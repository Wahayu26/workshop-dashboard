import { z } from 'zod';
import {
  Role,
  VehicleType,
  WorkOrderStatus,
  WorkOrderPriority,
  PaymentMethod,
  BookingStatus,
  MechanicSpecialization,
  MechanicStatus,
} from './enums';

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  phone: z.string().min(9, 'Nomor HP minimal 9 digit'),
  role: z.nativeEnum(Role).default(Role.CUSTOMER),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const CustomerSchema = z.object({
  fullName: z.string().min(2, 'Nama pelanggan minimal 2 karakter'),
  phone: z.string().min(9, 'Nomor HP minimal 9 digit'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

export const VehicleSchema = z.object({
  customerId: z.string().uuid('ID Pelanggan tidak valid'),
  vehicleType: z.nativeEnum(VehicleType),
  plateNumber: z.string().min(3, 'Nomor plat minimal 3 karakter').transform((v) => v.toUpperCase().trim()),
  brand: z.string().min(2, 'Merk kendaraan minimal 2 karakter'),
  model: z.string().min(2, 'Tipe/Model kendaraan minimal 2 karakter'),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  currentMileage: z.coerce.number().int().min(0, 'Kilometer tidak boleh negatif'),
  notes: z.string().optional(),
});

export type VehicleInput = z.infer<typeof VehicleSchema>;

export const ServiceSchema = z.object({
  categoryId: z.string().uuid('ID Kategori tidak valid'),
  code: z.string().min(2, 'Kode jasa minimal 2 karakter'),
  name: z.string().min(2, 'Nama jasa minimal 2 karakter'),
  description: z.string().optional(),
  vehicleType: z.enum(['CAR', 'MOTORCYCLE', 'ALL']),
  basePrice: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  estimatedDurationMinutes: z.coerce.number().int().min(5, 'Estimasi durasi minimal 5 menit'),
  isActive: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof ServiceSchema>;

export const SparePartSchema = z.object({
  supplierId: z.string().uuid().optional().or(z.literal('')),
  partNumber: z.string().min(2, 'Nomor part minimal 2 karakter'),
  name: z.string().min(2, 'Nama sparepart minimal 2 karakter'),
  brand: z.string().min(2, 'Merk minimal 2 karakter'),
  vehicleType: z.enum(['CAR', 'MOTORCYCLE', 'UNIVERSAL']),
  category: z.string().min(2, 'Kategori tidak boleh kosong'),
  purchasePrice: z.coerce.number().min(0, 'Harga beli tidak boleh negatif'),
  sellingPrice: z.coerce.number().min(0, 'Harga jual tidak boleh negatif'),
  stockQuantity: z.coerce.number().int().min(0, 'Stok tidak boleh negatif'),
  minStockAlert: z.coerce.number().int().min(0, 'Batas minimum tidak boleh negatif'),
  unit: z.string().min(1, 'Satuan wajib diisi (pcs, liter, set)'),
  shelfLocation: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type SparePartInput = z.infer<typeof SparePartSchema>;

export const BookingSchema = z.object({
  customerId: z.string().uuid('ID Pelanggan tidak valid'),
  vehicleId: z.string().uuid('ID Kendaraan tidak valid'),
  vehicleType: z.nativeEnum(VehicleType),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD'),
  preferredTimeSlot: z.string().min(3, 'Pilih jam servis'),
  serviceTypeNotes: z.string().min(3, 'Tuliskan jenis servis yang diinginkan'),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof BookingSchema>;

export const WorkOrderSchema = z.object({
  bookingId: z.string().uuid().optional().or(z.literal('')),
  customerId: z.string().uuid('ID Pelanggan wajib dipilih'),
  vehicleId: z.string().uuid('ID Kendaraan wajib dipilih'),
  mechanicId: z.string().uuid().optional().or(z.literal('')),
  entryMileage: z.coerce.number().int().min(0, 'Kilometer masuk tidak boleh negatif'),
  complaint: z.string().min(3, 'Keluhan pelanggan wajib diisi'),
  initialDiagnosis: z.string().optional(),
  priority: z.nativeEnum(WorkOrderPriority).default(WorkOrderPriority.NORMAL),
});

export type WorkOrderInput = z.infer<typeof WorkOrderSchema>;

export const WorkOrderStatusUpdateSchema = z.object({
  status: z.nativeEnum(WorkOrderStatus),
  mechanicId: z.string().uuid().optional(),
  qcNotes: z.string().optional(),
  qcPassed: z.boolean().optional(),
});

export type WorkOrderStatusUpdateInput = z.infer<typeof WorkOrderStatusUpdateSchema>;

export const PaymentSchema = z.object({
  invoiceId: z.string().uuid('ID Invoice tidak valid'),
  amount: z.coerce.number().min(1, 'Nominal pembayaran harus lebih dari 0'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentInput = z.infer<typeof PaymentSchema>;
