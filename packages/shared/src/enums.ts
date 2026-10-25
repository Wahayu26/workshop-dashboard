export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  MECHANIC = 'MECHANIC',
  CUSTOMER = 'CUSTOMER',
}

export enum VehicleType {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
}

export enum VehicleTypeFilter {
  ALL = 'ALL',
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
}

export enum WorkOrderStatus {
  PENDING = 'PENDING',             // Menunggu Antrian
  DIAGNOSING = 'DIAGNOSING',       // Diagnosa / Inspeksi
  IN_PROGRESS = 'IN_PROGRESS',     // Dikerjakan
  QC = 'QC',                       // Quality Control / Uji Coba
  COMPLETED = 'COMPLETED',         // Selesai (Siap Diambil/Dibayar)
  PAID = 'PAID',                   // Lunas
  CANCELLED = 'CANCELLED',         // Dibatalkan
}

export enum WorkOrderPriority {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
}

export enum ItemType {
  SERVICE = 'SERVICE',
  SPARE_PART = 'SPARE_PART',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  QRIS = 'QRIS',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
}

export enum StockMovementType {
  IN = 'IN',
  OUT_WORK_ORDER = 'OUT_WORK_ORDER',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ARRIVED = 'ARRIVED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
}

export enum MechanicStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFF_DUTY = 'OFF_DUTY',
}

export enum MechanicSpecialization {
  CAR_GENERAL = 'CAR_GENERAL',
  MOTOR_GENERAL = 'MOTOR_GENERAL',
  BOTH = 'BOTH',
  ENGINE_TUNING = 'ENGINE_TUNING',
  AC_ELECTRICAL = 'AC_ELECTRICAL',
  BRAKE_SUSPENSION = 'BRAKE_SUSPENSION',
}

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  CANCELLED = 'CANCELLED',
}
