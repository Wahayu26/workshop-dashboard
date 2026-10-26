# Arsitektur Multi-Tenant: 1 Bengkel 1 Container & Beda Database (1 Server)
**Dokumentasi Teknis & Panduan Implementasi Deployment BengkelKu**

---

## 1. Ringkasan Eksekutif & Latar Belakang

Berdasarkan kebutuhan operasional dan diskusi tim teknis:
* **"Beda database, tapi masih di 1 server"**
* **"1 bengkel 1 container"**
* **"Dibuat dengan Podman / Docker"**
* **"Opsi ekspansi ke VM baru bila kapasitas server telah penuh"**

Dokumen ini menyajikan panduan arsitektur **Container-per-Tenant & Database-per-Tenant** pada satu server host Linux menggunakan engine container **Podman** atau **Docker**.

### Mengapa Pendekatan Ini Sangat Tepat untuk BengkelKu?

| Kriteria | 1 Bengkel 1 Container & Beda Database | 1 Database Bersama (Shared Tenant DB) |
| :--- | :--- | :--- |
| **Isolasi Data Finansial** | **Tinggi (Kritis)**: Database terpisah fisik. Tidak ada risiko kebocoran data pelanggan/omset ke bengkel lain. | **Rentan**: Kesalahan satu baris query `WHERE tenant_id` dapat membocorkan data ke pihak ketiga. |
| **Blast Radius (Dampak Gangguan)** | Jika 1 bengkel mengalami *crash* atau *heavy load*, bengkel lain **tetap berjalan 100% normal**. | Satu bengkel error atau freeze, seluruh bengkel di sistem ikut terdampak. |
| **Backup & Pemulihan (SOP)** | Sangat mudah: Cukup ekspor `db_bengkel_a` tanpa menyentuh bengkel lain. | Sangat rumit jika hanya ingin restore data 1 bengkel tertentu. |
| **Kustomisasi Versi** | Bisa melakukan *canary update* atau upgrade bertahap per bengkel. | Semua bengkel harus update secara serentak. |

---

## 2. Topologi Arsitektur Sistem

```mermaid
flowchart TD
    subgraph ClientLayer["Klien / Pengguna Bengkel"]
        ClientA["Pelanggan & Admin Bengkel Jaya\nURL: jaya.bengkelku.id"]
        ClientB["Pelanggan & Admin Bengkel Sentosa\nURL: sentosa.bengkelku.id"]
        ClientN["Pelanggan & Admin Bengkel N\nURL: tenant-n.bengkelku.id"]
    end

    subgraph HostServer["1 HOST SERVER LINUX (Host dengan Podman / Docker)"]
        subgraph IngressLayer["Edge Routing & SSL"]
            Proxy["Reverse Proxy (Traefik / Nginx / Caddy)\nWildcard SSL: *.bengkelku.id"]
        end

        subgraph TenantA["Stack Container Bengkel Jaya"]
            WebA["Web Next.js\nPort internal 3000"]
            APIA["API NestJS\nPort internal 4000"]
        end

        subgraph TenantB["Stack Container Bengkel Sentosa"]
            WebB["Web Next.js\nPort internal 3000"]
            APIB["API NestJS\nPort internal 4000"]
        end

        subgraph TenantN["Stack Container Bengkel N"]
            WebN["Web Next.js\nPort internal 3000"]
            APIN["API NestJS\nPort internal 4000"]
        end

        subgraph DatabaseTier["PostgreSQL Cluster (Dedicated Databases)"]
            PG[(PostgreSQL Server 16)]
            DB_A[("db_bengkel_jaya")]
            DB_B[("db_bengkel_sentosa")]
            DB_N[("db_bengkel_n")]
            PG --- DB_A
            PG --- DB_B
            PG --- DB_N
        end

        subgraph CacheTier["Shared / Namespaced Redis"]
            Redis[(Redis Server 7)]
        end
    end

    ClientA -->|HTTPS| Proxy
    ClientB -->|HTTPS| Proxy
    ClientN -->|HTTPS| Proxy

    Proxy -->|Host: jaya.bengkelku.id| WebA
    Proxy -->|Host: jaya.bengkelku.id/api| APIA
    WebA --> APIA
    APIA --> DB_A
    APIA --> Redis

    Proxy -->|Host: sentosa.bengkelku.id| WebB
    Proxy -->|Host: sentosa.bengkelku.id/api| APIB
    WebB --> APIB
    APIB --> DB_B
    APIB --> Redis

    Proxy -->|Host: tenant-n.bengkelku.id| WebN
    Proxy -->|Host: tenant-n.bengkelku.id/api| APIN
    WebN --> APIN
    APIN --> DB_N
```

---

## 3. Mengapa Podman Sangat Direkomendasikan?

1. **Daemonless Architecture**: Tidak ada background daemon `dockerd` yang boros memori atau menjadi *single point of failure*.
2. **Rootless Security**: Container berjalan di bawah user Linux non-root (misalnya user `bengkelku`), sehingga aman dari eksploitasi privilege escalation.
3. **100% Kompatibel OCI & Docker CLI**: Semua file `Dockerfile` dan file `docker-compose.yml` yang sudah dibuat tim dapat langsung dieksekusi dengan `podman` dan `podman-compose`.
4. **Native Systemd Integration**: Podman dapat meng-generate unit file systemd (`podman generate systemd` atau Quadlet), sehingga container otomatis restart ketika server reboot layaknya service Linux bawaan.

---

## 4. Spesifikasi Dockerfile Produksi

### A. Dockerfile untuk Backend API (`apps/api/Dockerfile`)
```dockerfile
# Stage 1: Build stage
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

# Copy root monorepo config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install dependencies & build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bengkelku/shared build
RUN pnpm --filter @bengkelku/api build

# Stage 2: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/dist ./packages/shared/dist
COPY apps/api/package.json ./apps/api/
COPY apps/api/dist ./apps/api/dist
COPY apps/api/prisma ./apps/api/prisma

RUN pnpm install --prod --filter @bengkelku/api

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node apps/api/dist/main.js"]
```

### B. Dockerfile untuk Frontend Web (`apps/web/Dockerfile`)
```dockerfile
# Stage 1: Dependencies & Build
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bengkelku/shared build

# Set build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm --filter @bengkelku/web build

# Stage 2: Minimal Standalone Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy Next.js standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

> **Catatan Optimasi**: Dengan mengaktifkan `output: 'standalone'` pada `next.config.js`, image Next.js hanya berukuran ~120MB dan mengonsumsi RAM ~60-80MB saja!

---

## 5. Struktur Direktori Deployment di Server Host

Pada server Linux host, kita mengatur struktur direktori yang rapi dan terisolasi:

```text
/opt/bengkelku/
├── infrastructure/
│   ├── docker-compose.infra.yml     # PostgreSQL Server & Redis Cluster
│   └── traefik/                      # Traefik / Nginx Reverse Proxy & SSL Let's Encrypt
├── templates/
│   └── docker-compose.tenant.yml    # Template compose untuk tenant baru
├── tenants/
│   ├── jaya-motor/
│   │   ├── .env                      # Database URL & JWT Secret spesifik Jaya Motor
│   │   └── docker-compose.yml
│   ├── sentosa-auto/
│   │   ├── .env                      # Database URL & JWT Secret spesifik Sentosa
│   │   └── docker-compose.yml
└── scripts/
    ├── provision-tenant.sh           # Skrip otomatisasi pembuatan bengkel baru
    ├── backup-tenant.sh              # Skrip backup database per tenant
    └── update-all-tenants.sh         # Skrip rolling update container
```

---

## 6. Template Compose per Tenant (`docker-compose.tenant.yml`)

Setiap bengkel dijalankan menggunakan template isolasi dengan network khusus:

```yaml
version: '3.8'

services:
  web:
    image: bengkelku-web:latest
    container_name: bengkelku-${TENANT_SLUG}-web
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://${TENANT_DOMAIN}/api/v1
    networks:
      - bengkelku-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${TENANT_SLUG}-web.rule=Host(`${TENANT_DOMAIN}`)"
      - "traefik.http.routers.${TENANT_SLUG}-web.entrypoints=websecure"
      - "traefik.http.routers.${TENANT_SLUG}-web.tls=true"
      - "traefik.http.routers.${TENANT_SLUG}-web.tls.certresolver=letsencrypt"

  api:
    image: bengkelku-api:latest
    container_name: bengkelku-${TENANT_SLUG}-api
    restart: always
    environment:
      - PORT=4000
      - NODE_ENV=production
      - CORS_ORIGIN=https://${TENANT_DOMAIN}
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@bengkelku-postgres:5432/db_bengkel_${TENANT_SLUG}?schema=public
      - JWT_ACCESS_SECRET=${JWT_SECRET}
    networks:
      - bengkelku-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${TENANT_SLUG}-api.rule=Host(`${TENANT_DOMAIN}`) && PathPrefix(`/api`)"
      - "traefik.http.routers.${TENANT_SLUG}-api.entrypoints=websecure"
      - "traefik.http.routers.${TENANT_SLUG}-api.tls=true"

networks:
  bengkelku-network:
    external: true
```

---

## 7. Skrip Otomatisasi Penambahan Bengkel Baru (`provision-tenant.sh`)

Untuk membuat bengkel baru dalam waktu **di bawah 60 detik**, tim DevOps/SysAdmin cukup menjalankan:

```bash
#!/usr/bin/env bash
# File: /opt/bengkelku/scripts/provision-tenant.sh
set -e

TENANT_NAME=$1
TENANT_SLUG=$2
TENANT_DOMAIN="${TENANT_SLUG}.bengkelku.id"

if [ -z "$TENANT_NAME" ] || [ -z "$TENANT_SLUG" ]; then
  echo "Usage: ./provision-tenant.sh <Tenant Name> <slug>"
  echo "Example: ./provision-tenant.sh 'Jaya Motor' 'jayamotor'"
  exit 1
fi

echo "=========================================================="
echo "PROVISIONING TENANT BARU: $TENANT_NAME ($TENANT_DOMAIN)"
echo "=========================================================="

# 1. Buat direktori tenant
TENANT_DIR="/opt/bengkelku/tenants/${TENANT_SLUG}"
mkdir -p "$TENANT_DIR"

# 2. Buat Database Terpisah di PostgreSQL
DB_NAME="db_bengkel_${TENANT_SLUG}"
echo "-> Membuat database terisolasi: $DB_NAME..."
podman exec -i bengkelku-postgres psql -U postgres -c "CREATE DATABASE \"$DB_NAME\";"

# 3. Generate Konfigurasi Environment
JWT_SECRET=$(openssl rand -hex 32)
cat <<EOF > "$TENANT_DIR/.env"
TENANT_NAME="$TENANT_NAME"
TENANT_SLUG="$TENANT_SLUG"
TENANT_DOMAIN="$TENANT_DOMAIN"
DB_NAME="$DB_NAME"
DB_USER="bengkelku_user"
DB_PASS="bengkelku_secret"
JWT_SECRET="$JWT_SECRET"
EOF

# 4. Copy template docker-compose
cp /opt/bengkelku/templates/docker-compose.tenant.yml "$TENANT_DIR/docker-compose.yml"

# 5. Jalankan Migration Prisma & Seed Data Awal ke DB Baru
echo "-> Menjalankan Prisma Database Migration & Seeding..."
DATABASE_URL="postgresql://bengkelku_user:bengkelku_secret@bengkelku-postgres:5432/${DB_NAME}?schema=public" \
podman run --rm --network bengkelku-network \
  -e DATABASE_URL="postgresql://bengkelku_user:bengkelku_secret@bengkelku-postgres:5432/${DB_NAME}?schema=public" \
  bengkelku-api:latest sh -c "npx prisma migrate deploy && npx ts-node prisma/seed.ts"

# 6. Nyalakan Stack Container Bengkel Baru
echo "-> Menjalankan Container Tenant..."
cd "$TENANT_DIR"
podman-compose --env-file .env up -d

echo "=========================================================="
echo "BERHASIL! Bengkel '$TENANT_NAME' sudah online:"
echo "URL Akses: https://${TENANT_DOMAIN}"
echo "=========================================================="
```

---

## 8. Estimasi Kapasitas Server (Sizing & Scaling)

### Penggunaan Resource per Bengkel (Idling & Normal Load)
* **Web Container (Next.js Standalone)**: ~60 MB RAM, <1% CPU
* **API Container (NestJS Production)**: ~90 MB RAM, <2% CPU
* **PostgreSQL Overhead (Database idle connection pool)**: ~15 MB RAM per database
* **Total Resource per Bengkel**: **~165 MB - 200 MB RAM**

### Kapasitas Tampung 1 Server VM:
| Spek Server Host | Estimasi Kapasitas Bengkel | Status Kinerja |
| :--- | :--- | :--- |
| **VM 4 vCPU / 8 GB RAM** | **15 s/d 25 Bengkel** | Sangat Stabil & Hemat Biaya |
| **VM 8 vCPU / 16 GB RAM** | **40 s/d 60 Bengkel** | Optimal untuk SaaS Komersial |
| **Dedicated Server (32 GB RAM)** | **120+ Bengkel** | Skala Menengah |

> **Strategi Scaling**: Ketika 1 VM sudah mencapai 70% utilisasi RAM/CPU, opsi rekan Anda: *"Ato ngga nanti gue buatin VM baru"* adalah langkah yang sangat tepat. Kita tinggal menduplikasi template ini ke VM Server 2, dan mengarahkan DNS subdomain bengkel baru ke IP VM Server 2 tersebut!

---

## 9. SOP Backup & Restore Database Terisolasi

### Backup Otomatis Harian per Bengkel
```bash
# Backup satu bengkel tanpa mengganggu bengkel lain
podman exec -t bengkelku-postgres pg_dump -U bengkelku_user -d db_bengkel_jayamotor | gzip > /opt/bengkelku/backups/jayamotor_$(date +%Y%m%d).sql.gz
```

### Restore Database
```bash
# Restore jika bengkel memerlukan rollback data
gunzip -c /opt/bengkelku/backups/jayamotor_20261025.sql.gz | podman exec -i bengkelku-postgres psql -U bengkelku_user -d db_bengkel_jayamotor
```

---

## 10. Checklist Kesiapan Kode Repository

- [x] Backend NestJS telah menggunakan arsitektur modular (`@nestjs/common`, `PrismaService`, JWT Guard, RBAC).
- [x] Database model Prisma mendukung relasi otomotif lengkap & indexing cepat.
- [x] Frontend Next.js 14 mendukung standalone build yang ramah container mini.
- [x] Seluruh routing port dan base API dinamis melalui environment variable `NEXT_PUBLIC_API_URL` dan `DATABASE_URL`.

---

## 11. Studi Kasus Nyata: Deployment Server UAT (`10.100.108.224`)

Pada deployment aktual di server UAT Rocky Linux, BengkelKu berhasil dijalankan berdampingan (*coexistence*) secara harmonis dengan aplikasi eksisting (**BengkelFlow**) di port 80 tanpa konflik port maupun gangguan firewall jaringan:

### Topologi Port & Routing:
* **Apache HTTPD (Port 80 Host)**: Berfungsi sebagai Ingress / Reverse Proxy publik.
  * `/cars/` &rarr; Proxy ke container `bengkelflow-bengkel01` (`http://127.0.0.1:8101/cars/`)
  * `/bengkelku/` &rarr; Proxy ke container `bengkelku-web-01` (`http://127.0.0.1:8201/bengkelku/`)
* **Container BengkelKu**:
  * `bengkelku-web-01`: Port `8201:3000` (`localhost/bengkelku-web:latest`)
  * `bengkelku-api-01`: Port `4001:4000` (`localhost/bengkelku-api:latest`)
  * `bengkelku-postgres`: Port `5432:5432` (`postgres:16-alpine`)
* **SELinux Requirement**:
  ```bash
  setsebool -P httpd_can_network_connect 1
  ```
