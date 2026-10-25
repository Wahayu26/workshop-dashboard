import { PrismaClient, Role, VehicleType, WorkOrderStatus, WorkOrderPriority, ItemType, PaymentStatus, PaymentMethod, MechanicSpecialization, MechanicStatus, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BengkelKu database seed...');

  // 1. Clear existing data
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.workOrderItem.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.serviceReminder.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.mechanicSchedule.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workshopSetting.deleteMany();

  // 2. Settings
  await prisma.workshopSetting.create({
    data: {
      name: 'BengkelKu Auto & Moto Service Center',
      address: 'Jl. Surya Sumantri No. 120, Bandung & Jakarta',
      phone: '0812-3456-7890',
      email: 'bengkelku.official@gmail.com',
      taxPercentage: 11.0,
      currency: 'IDR',
      operatingHours: {
        monday_friday: '08:00 - 17:00',
        saturday: '08:00 - 15:00',
        sunday: 'Tutup / Khusus Booking Darurat',
      },
      invoiceFooter: 'Terima kasih atas kepercayaan Anda. Garansi servis 7 hari / 500 km.',
    },
  });

  // 3. Users & Passwords
  const defaultPassword = await bcrypt.hash('bengkel123', 10);

  const owner = await prisma.user.create({
    data: {
      email: 'owner@bengkelku.id',
      passwordHash: defaultPassword,
      fullName: 'Bambang Sutrisno (Owner)',
      phone: '081211110001',
      role: Role.OWNER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@bengkelku.id',
      passwordHash: defaultPassword,
      fullName: 'Rian Pratama (Admin)',
      phone: '081211110002',
      role: Role.ADMIN,
    },
  });

  const cashier = await prisma.user.create({
    data: {
      email: 'kasir@bengkelku.id',
      passwordHash: defaultPassword,
      fullName: 'Siti Rahmawati (Kasir)',
      phone: '081211110003',
      role: Role.CASHIER,
    },
  });

  const mechanicUser1 = await prisma.user.create({
    data: {
      email: 'mekanik1@bengkelku.id',
      passwordHash: defaultPassword,
      fullName: 'Agus Santoso',
      phone: '081211110004',
      role: Role.MECHANIC,
    },
  });

  const mechanicUser2 = await prisma.user.create({
    data: {
      email: 'mekanik2@bengkelku.id',
      passwordHash: defaultPassword,
      fullName: 'Hendra Wijaya',
      phone: '081211110005',
      role: Role.MECHANIC,
    },
  });

  const mechanicUser3 = await prisma.user.create({
    data: {
      email: 'mekanik3@bengkelku.id',
      passwordHash: defaultPassword,
      fullName: 'Dedi Kurniawan',
      phone: '081211110006',
      role: Role.MECHANIC,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'budi@gmail.com',
      passwordHash: defaultPassword,
      fullName: 'Budi Darmawan',
      phone: '081399881122',
      role: Role.CUSTOMER,
    },
  });

  // 4. Mechanics profile
  const mechanic1 = await prisma.mechanic.create({
    data: {
      userId: mechanicUser1.id,
      employeeId: 'MEK-001',
      specialization: MechanicSpecialization.CAR_GENERAL,
      status: MechanicStatus.AVAILABLE,
      dailyTarget: 5,
      rating: 4.9,
    },
  });

  const mechanic2 = await prisma.mechanic.create({
    data: {
      userId: mechanicUser2.id,
      employeeId: 'MEK-002',
      specialization: MechanicSpecialization.MOTOR_GENERAL,
      status: MechanicStatus.BUSY,
      dailyTarget: 7,
      rating: 4.8,
    },
  });

  const mechanic3 = await prisma.mechanic.create({
    data: {
      userId: mechanicUser3.id,
      employeeId: 'MEK-003',
      specialization: MechanicSpecialization.AC_ELECTRICAL,
      status: MechanicStatus.AVAILABLE,
      dailyTarget: 4,
      rating: 4.95,
    },
  });

  // 5. Customers & Vehicles
  const cust1 = await prisma.customer.create({
    data: {
      userId: customerUser.id,
      fullName: 'Budi Darmawan',
      phone: '081399881122',
      email: 'budi@gmail.com',
      address: 'Komp. Buah Batu Regency Blok C-12, Bandung',
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      fullName: 'Dewi Lestari',
      phone: '085712349988',
      email: 'dewi.lestari@gmail.com',
      address: 'Jl. Tebet Barat Dalam No. 45, Jakarta Selatan',
    },
  });

  const cust3 = await prisma.customer.create({
    data: {
      fullName: 'Ahmad Fauzi',
      phone: '082188776655',
      email: 'fauzi.ahmad@outlook.com',
      address: 'Jl. Dago Asri No. 18, Bandung',
    },
  });

  // Vehicles
  const car1 = await prisma.vehicle.create({
    data: {
      customerId: cust1.id,
      vehicleType: VehicleType.CAR,
      plateNumber: 'B 1452 SKA',
      brand: 'Toyota',
      model: 'Avanza 1.5 Veloz',
      year: 2021,
      color: 'Putih Mutiara',
      currentMileage: 42500,
      lastServiceDate: new Date('2026-08-15'),
      nextServiceDueDate: new Date('2026-11-15'),
      nextServiceDueMileage: 50000,
    },
  });

  const car2 = await prisma.vehicle.create({
    data: {
      customerId: cust2.id,
      vehicleType: VehicleType.CAR,
      plateNumber: 'B 8899 TAY',
      brand: 'Honda',
      model: 'HR-V 1.5 SE',
      year: 2022,
      color: 'Abu Metalik',
      currentMileage: 28000,
      lastServiceDate: new Date('2026-07-20'),
      nextServiceDueDate: new Date('2026-10-20'),
      nextServiceDueMileage: 35000,
    },
  });

  const motor1 = await prisma.vehicle.create({
    data: {
      customerId: cust1.id,
      vehicleType: VehicleType.MOTORCYCLE,
      plateNumber: 'D 4567 KLA',
      brand: 'Yamaha',
      model: 'NMAX 155 Connected',
      year: 2023,
      color: 'Matte Blue',
      currentMileage: 12400,
      lastServiceDate: new Date('2026-09-10'),
      nextServiceDueDate: new Date('2026-11-10'),
      nextServiceDueMileage: 15000,
    },
  });

  const motor2 = await prisma.vehicle.create({
    data: {
      customerId: cust3.id,
      vehicleType: VehicleType.MOTORCYCLE,
      plateNumber: 'D 3344 BDG',
      brand: 'Honda',
      model: 'Vario 160 CBS',
      year: 2023,
      color: 'Hitam Doff',
      currentMileage: 8900,
      lastServiceDate: new Date('2026-09-25'),
      nextServiceDueDate: new Date('2026-12-25'),
      nextServiceDueMileage: 12000,
    },
  });

  // 6. Service Categories & Services
  const catOli = await prisma.serviceCategory.create({
    data: { name: 'Ganti Oli & Pelumas', vehicleType: 'ALL', icon: 'Droplets', sortOrder: 1 },
  });
  const catTuneUp = await prisma.serviceCategory.create({
    data: { name: 'Tune Up & Servis Berkala', vehicleType: 'ALL', icon: 'Wrench', sortOrder: 2 },
  });
  const catRem = await prisma.serviceCategory.create({
    data: { name: 'Sistem Pengereman', vehicleType: 'ALL', icon: 'Disc', sortOrder: 3 },
  });
  const catAC = await prisma.serviceCategory.create({
    data: { name: 'AC & Sirkulasi Mobil', vehicleType: 'CAR', icon: 'Wind', sortOrder: 4 },
  });
  const catCVT = await prisma.serviceCategory.create({
    data: { name: 'Servis CVT & Rantai Motor', vehicleType: 'MOTORCYCLE', icon: 'Cog', sortOrder: 5 },
  });

  // Services
  const srvOliMobil = await prisma.service.create({
    data: {
      categoryId: catOli.id,
      code: 'SRV-MOB-001',
      name: 'Jasa Ganti Oli Mesin Mobil',
      description: 'Termasuk cek 15 titik vital kendaraan',
      vehicleType: 'CAR',
      basePrice: 50000,
      estimatedDurationMinutes: 30,
    },
  });

  const srvTuneUpMobil = await prisma.service.create({
    data: {
      categoryId: catTuneUp.id,
      code: 'SRV-MOB-002',
      name: 'Tune Up Mesin Mobil (Carbon Cleaner + Busi + Throttle Body)',
      description: 'Pembersihan ruang bakar, kalibrasi sensor, cek busi & filter udara',
      vehicleType: 'CAR',
      basePrice: 350000,
      estimatedDurationMinutes: 90,
    },
  });

  const srvACMobil = await prisma.service.create({
    data: {
      categoryId: catAC.id,
      code: 'SRV-MOB-003',
      name: 'Servis AC Mobil & Flushing Freon',
      description: 'Pembersihan blower, evaporator, ganti oli kompresor & isi freon R134a',
      vehicleType: 'CAR',
      basePrice: 450000,
      estimatedDurationMinutes: 120,
    },
  });

  const srvOliMotor = await prisma.service.create({
    data: {
      categoryId: catOli.id,
      code: 'SRV-MOT-001',
      name: 'Jasa Ganti Oli Mesin + Oli Gardan Motor',
      description: 'Termasuk setel rantai / cek v-belt dan tekanan angin',
      vehicleType: 'MOTORCYCLE',
      basePrice: 20000,
      estimatedDurationMinutes: 20,
    },
  });

  const srvCVTMotor = await prisma.service.create({
    data: {
      categoryId: catCVT.id,
      code: 'SRV-MOT-002',
      name: 'Servis CVT Komplit Matic & Greasing',
      description: 'Bongkar, bersihkan mangkok kopling, roller, pulley, dan ganti gemuk CVT',
      vehicleType: 'MOTORCYCLE',
      basePrice: 85000,
      estimatedDurationMinutes: 45,
    },
  });

  // 7. Suppliers & Spareparts
  const supAstra = await prisma.supplier.create({
    data: {
      name: 'PT Astra Otoparts Tbk',
      contactPerson: 'Budi Cahyadi',
      phone: '021-4603930',
      email: 'sales@astra-otoparts.com',
      address: 'Jl. Pegangsaan Dua Km. 2.2, Kelapa Gading, Jakarta',
    },
  });

  const supPertamina = await prisma.supplier.create({
    data: {
      name: 'PT Pertamina Lubricants Dist.',
      contactPerson: 'Agung Wicaksono',
      phone: '021-3815111',
      email: 'order@pertaminalubricants.com',
      address: 'Oil Centre Building, Jakarta Pusat',
    },
  });

  const part1 = await prisma.sparePart.create({
    data: {
      supplierId: supPertamina.id,
      partNumber: 'LUB-FAST-10W40',
      name: 'Pertamina Fastron Gold 10W-40 (4 Liter)',
      brand: 'Pertamina',
      vehicleType: 'CAR',
      category: 'Oli Mesin',
      purchasePrice: 280000,
      sellingPrice: 360000,
      stockQuantity: 18,
      minStockAlert: 5,
      unit: 'galon',
      shelfLocation: 'Rak A-01',
    },
  });

  const part2 = await prisma.sparePart.create({
    data: {
      supplierId: supAstra.id,
      partNumber: 'FLT-AVZ-001',
      name: 'Filter Oli Toyota Avanza / Rush / Xenia Original',
      brand: 'Toyota Genuine Parts',
      vehicleType: 'CAR',
      category: 'Filter',
      purchasePrice: 32000,
      sellingPrice: 48000,
      stockQuantity: 24,
      minStockAlert: 8,
      unit: 'pcs',
      shelfLocation: 'Rak B-04',
    },
  });

  const part3 = await prisma.sparePart.create({
    data: {
      supplierId: supPertamina.id,
      partNumber: 'LUB-END-MATIC',
      name: 'Enduro Matic 10W-30 0.8L',
      brand: 'Pertamina',
      vehicleType: 'MOTORCYCLE',
      category: 'Oli Mesin',
      purchasePrice: 42000,
      sellingPrice: 55000,
      stockQuantity: 3, // Low stock simulation!
      minStockAlert: 10,
      unit: 'botol',
      shelfLocation: 'Rak M-02',
    },
  });

  const part4 = await prisma.sparePart.create({
    data: {
      supplierId: supAstra.id,
      partNumber: 'PAD-VAR-CBS',
      name: 'Kampas Rem Depan Honda Vario 125/150/160',
      brand: 'AHM Genuine Parts',
      vehicleType: 'MOTORCYCLE',
      category: 'Pengereman',
      purchasePrice: 45000,
      sellingPrice: 65000,
      stockQuantity: 15,
      minStockAlert: 5,
      unit: 'set',
      shelfLocation: 'Rak M-05',
    },
  });

  // 8. Bookings
  const booking1 = await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261025-01',
      customerId: cust1.id,
      vehicleId: car1.id,
      vehicleType: VehicleType.CAR,
      preferredDate: new Date('2026-10-25'),
      preferredTimeSlot: '09:00 - 10:00',
      serviceTypeNotes: 'Ganti oli rutin & cek rem berdecit',
      status: BookingStatus.ARRIVED,
      queueNumber: 1,
      notes: 'Pelanggan minta diselesaikan sebelum makan siang',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261025-02',
      customerId: cust3.id,
      vehicleId: motor2.id,
      vehicleType: VehicleType.MOTORCYCLE,
      preferredDate: new Date('2026-10-25'),
      preferredTimeSlot: '10:30 - 11:30',
      serviceTypeNotes: 'CVT gredek & ganti oli matic',
      status: BookingStatus.CONFIRMED,
      queueNumber: 2,
    },
  });

  // 9. Work Orders & Invoices (Realistic active pipeline)
  // Work Order 1: Sedang Dikerjakan (IN_PROGRESS) - Mobil Avanza
  const wo1 = await prisma.workOrder.create({
    data: {
      woNumber: 'WO-20261025-001',
      bookingId: booking1.id,
      customerId: cust1.id,
      vehicleId: car1.id,
      mechanicId: mechanic1.id,
      entryMileage: 42520,
      complaint: 'Tarikan terasa berat, ganti oli berkala 40.000 km dan rem belakang agak bunyi',
      initialDiagnosis: 'Oli mesin hitam pekat, filter oli kotor, tromol rem belakang berdebu',
      status: WorkOrderStatus.IN_PROGRESS,
      priority: WorkOrderPriority.NORMAL,
      actualStart: new Date('2026-10-25T09:15:00Z'),
      createdById: admin.id,
    },
  });

  await prisma.workOrderItem.createMany({
    data: [
      {
        workOrderId: wo1.id,
        itemType: ItemType.SERVICE,
        serviceId: srvOliMobil.id,
        name: srvOliMobil.name,
        quantity: 1,
        unitPrice: 50000,
        discount: 0,
        totalPrice: 50000,
      },
      {
        workOrderId: wo1.id,
        itemType: ItemType.SERVICE,
        serviceId: srvTuneUpMobil.id,
        name: srvTuneUpMobil.name,
        quantity: 1,
        unitPrice: 350000,
        discount: 25000,
        totalPrice: 325000,
      },
      {
        workOrderId: wo1.id,
        itemType: ItemType.SPARE_PART,
        sparePartId: part1.id,
        name: part1.name,
        quantity: 1,
        unitPrice: 360000,
        discount: 0,
        totalPrice: 360000,
      },
      {
        workOrderId: wo1.id,
        itemType: ItemType.SPARE_PART,
        sparePartId: part2.id,
        name: part2.name,
        quantity: 1,
        unitPrice: 48000,
        discount: 0,
        totalPrice: 48000,
      },
    ],
  });

  // Work Order 2: Selesai & Lunas (PAID) - Motor NMAX
  const wo2 = await prisma.workOrder.create({
    data: {
      woNumber: 'WO-20261024-005',
      customerId: cust1.id,
      vehicleId: motor1.id,
      mechanicId: mechanic2.id,
      entryMileage: 12400,
      complaint: 'Servis CVT berkala, tarikan awal getar',
      initialDiagnosis: 'Roller aus dan mangkok ganda kotor oli gemuk kering',
      status: WorkOrderStatus.PAID,
      priority: WorkOrderPriority.NORMAL,
      actualStart: new Date('2026-10-24T13:00:00Z'),
      actualCompletion: new Date('2026-10-24T14:15:00Z'),
      qcNotes: 'Uji jalan halus, getaran CVT hilang 100%',
      qcPassed: true,
      createdById: cashier.id,
    },
  });

  await prisma.workOrderItem.createMany({
    data: [
      {
        workOrderId: wo2.id,
        itemType: ItemType.SERVICE,
        serviceId: srvCVTMotor.id,
        name: srvCVTMotor.name,
        quantity: 1,
        unitPrice: 85000,
        discount: 0,
        totalPrice: 85000,
      },
      {
        workOrderId: wo2.id,
        itemType: ItemType.SERVICE,
        serviceId: srvOliMotor.id,
        name: srvOliMotor.name,
        quantity: 1,
        unitPrice: 20000,
        discount: 0,
        totalPrice: 20000,
      },
      {
        workOrderId: wo2.id,
        itemType: ItemType.SPARE_PART,
        sparePartId: part3.id,
        name: part3.name,
        quantity: 1,
        unitPrice: 55000,
        discount: 0,
        totalPrice: 55000,
      },
    ],
  });

  // Invoice & Payment for WO2
  const subtotalSrv = 105000;
  const subtotalPrt = 55000;
  const subtotal = subtotalSrv + subtotalPrt; // 160.000
  const tax = subtotal * 0.11; // 17.600
  const total = subtotal + tax; // 177.600

  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-20261024-008',
      workOrderId: wo2.id,
      customerId: cust1.id,
      subtotalServices: subtotalSrv,
      subtotalParts: subtotalPrt,
      discountAmount: 0,
      taxPercentage: 11.0,
      taxAmount: tax,
      totalAmount: total,
      paymentStatus: PaymentStatus.PAID,
      dueDate: new Date('2026-10-24'),
      createdById: cashier.id,
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv2.id,
      paymentNumber: 'PAY-20261024-008-1',
      amount: total,
      paymentMethod: PaymentMethod.QRIS,
      referenceNumber: 'QRIS-ID9981245012',
      receivedById: cashier.id,
      notes: 'Pembayaran via QRIS Mandiri',
    },
  });

  console.log('✅ BengkelKu database seed completed successfully!');
  console.log('📌 Akun Login Default:');
  console.log('   - Owner: owner@bengkelku.id / bengkel123');
  console.log('   - Admin: admin@bengkelku.id / bengkel123');
  console.log('   - Kasir: kasir@bengkelku.id / bengkel123');
  console.log('   - Mekanik: mekanik1@bengkelku.id / bengkel123');
  console.log('   - Pelanggan: budi@gmail.com / bengkel123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
