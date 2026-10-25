-- Seed Workshop Setting
INSERT INTO "workshop_settings" ("id", "name", "address", "phone", "email", "tax_percentage", "currency", "operating_hours", "invoice_footer", "updated_at")
VALUES (
  'ws-default',
  'BengkelKu Auto & Moto Service Center',
  'Jl. Surya Sumantri No. 120, Bandung & Jakarta',
  '0812-3456-7890',
  'bengkelku.official@gmail.com',
  11.0,
  'IDR',
  '{"monday_friday": "08:00 - 17:00", "saturday": "08:00 - 15:00", "sunday": "Tutup / Booking Khusus"}'::jsonb,
  'Terima kasih atas kepercayaan Anda. Garansi servis resmi 7 hari / 500 km.',
  CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Seed Default Users (Password: bengkel123)
INSERT INTO "users" ("id", "email", "password_hash", "full_name", "phone", "role", "is_active", "created_at", "updated_at")
VALUES
  ('usr-owner-01', 'owner@bengkelku.id', '$2a$10$hF71Va4f3gNvNvqoJPOI3uzwCnaY13LZcW4N2TKeNdEn43ikr3axC', 'Bambang Sutrisno (Owner)', '081211110001', 'OWNER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr-admin-01', 'admin@bengkelku.id', '$2a$10$hF71Va4f3gNvNvqoJPOI3uzwCnaY13LZcW4N2TKeNdEn43ikr3axC', 'Rian Pratama (Admin)', '081211110002', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr-cashier-01', 'kasir@bengkelku.id', '$2a$10$hF71Va4f3gNvNvqoJPOI3uzwCnaY13LZcW4N2TKeNdEn43ikr3axC', 'Siti Rahmawati (Kasir)', '081211110003', 'CASHIER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr-mech-01', 'agus.mekanik@bengkelku.id', '$2a$10$hF71Va4f3gNvNvqoJPOI3uzwCnaY13LZcW4N2TKeNdEn43ikr3axC', 'Agus Santoso (Mekanik)', '081211110004', 'MECHANIC', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr-mech-02', 'bambang.mekanik@bengkelku.id', '$2a$10$hF71Va4f3gNvNvqoJPOI3uzwCnaY13LZcW4N2TKeNdEn43ikr3axC', 'Bambang Irawan (Mekanik)', '081211110005', 'MECHANIC', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Seed Service Categories
INSERT INTO "service_categories" ("id", "name", "vehicle_type", "icon", "sort_order", "created_at", "updated_at")
VALUES
  ('cat-1', 'Ganti Oli & Pelumas', 'ALL', 'Droplets', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-2', 'Tune Up & Servis Berkala', 'ALL', 'Wrench', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-3', 'Sistem Pengereman', 'CAR', 'Disc', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-4', 'AC Mobil & Pendingin', 'CAR', 'Wind', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-5', 'CVT & Transmisi Motor', 'MOTORCYCLE', 'Cog', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Seed Services
INSERT INTO "services" ("id", "code", "category_id", "vehicle_type", "name", "description", "base_price", "estimated_duration_minutes", "is_active", "created_at", "updated_at")
VALUES
  ('srv-1', 'SRV-MOB-001', 'cat-1', 'CAR', 'Jasa Ganti Oli Mesin Mobil & 15 Titik Cek', 'Kuras oli lama, pasang oli & filter baru, cek 15 titik keselamatan', 50000, 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv-2', 'SRV-MOB-002', 'cat-2', 'CAR', 'Tune Up Mesin Injeksi Mobil & Carbon Clean', 'Pembersihan ruang bakar piston, busi, kalibrasi scanner OBD2', 350000, 90, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv-3', 'SRV-MOB-003', 'cat-4', 'CAR', 'Servis AC Komplit & Flushing Freon R134a', 'Pembersihan blower evaporator, oli kompresor & isi freon murni', 450000, 120, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv-4', 'SRV-MOB-004', 'cat-3', 'CAR', 'Servis Rem 4 Roda & Bubut Piringan Cakram', 'Bongkar kaliper rem, bersihkan kampas, bleeding minyak rem', 280000, 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv-5', 'SRV-MOT-001', 'cat-1', 'MOTORCYCLE', 'Jasa Ganti Oli Mesin + Oli Gardan Motor', 'Ganti oli mesin & transmisi gardan matic, setel rem & tekanan ban', 20000, 20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv-6', 'SRV-MOT-002', 'cat-5', 'MOTORCYCLE', 'Servis CVT Komplit Matic & Greasing', 'Bongkar CVT, bersihkan mangkok kopling, cek roller & v-belt', 85000, 45, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv-7', 'SRV-MOT-003', 'cat-2', 'MOTORCYCLE', 'Tune Up Injeksi Motor (Ultrasonic Cleaner)', 'Pembersihan injector mesin ultrasonic, cek busi & reset ECU', 95000, 40, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Seed Mechanics
INSERT INTO "mechanics" ("id", "user_id", "employee_id", "specialization", "status", "daily_target", "rating", "created_at", "updated_at")
VALUES
  ('mech-1', 'usr-mech-01', 'MECH-001', 'CAR_GENERAL', 'AVAILABLE', 5, 4.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mech-2', 'usr-mech-02', 'MECH-002', 'MOTOR_GENERAL', 'AVAILABLE', 5, 4.92, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Seed Customers
INSERT INTO "customers" ("id", "full_name", "phone", "email", "address", "created_at", "updated_at")
VALUES
  ('cust-1', 'Budi Darmawan', '0813-9988-1122', 'budi@gmail.com', 'Komp. Buah Batu Regency Blok C-12, Bandung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cust-2', 'Ahmad Fauzi', '0821-8877-6655', 'ahmad.fauzi@yahoo.com', 'Jl. Dago Atas No. 45, Bandung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cust-3', 'Dewi Lestari', '0857-1234-9988', 'dewi.lestari@gmail.com', 'Jl. Tebet Barat Raya No. 18, Jakarta Selatan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Seed Vehicles
INSERT INTO "vehicles" ("id", "customer_id", "vehicle_type", "plate_number", "brand", "model", "year", "current_mileage", "created_at", "updated_at")
VALUES
  ('veh-1', 'cust-1', 'CAR', 'B 1452 SKA', 'Toyota', 'Avanza 1.5 Veloz', 2021, 42350, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('veh-2', 'cust-2', 'MOTORCYCLE', 'D 3344 BDG', 'Honda', 'Vario 160 CBS', 2023, 14200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('veh-3', 'cust-3', 'CAR', 'B 8899 TAY', 'Honda', 'HR-V 1.5 SE', 2022, 28400, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
