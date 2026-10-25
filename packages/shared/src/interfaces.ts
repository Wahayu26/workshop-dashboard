import {
  Role,
  VehicleType,
  WorkOrderStatus,
  WorkOrderPriority,
  ItemType,
  PaymentStatus,
  PaymentMethod,
  BookingStatus,
  MechanicStatus,
  MechanicSpecialization,
} from './enums';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

export interface CustomerDto {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  vehiclesCount?: number;
}

export interface VehicleDto {
  id: string;
  customerId: string;
  vehicleType: VehicleType;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  currentMileage: number;
  lastServiceDate?: string;
  nextServiceDueDate?: string;
  nextServiceDueMileage?: number;
  customer?: CustomerDto;
}

export interface ServiceDto {
  id: string;
  categoryId: string;
  categoryName?: string;
  code: string;
  name: string;
  description?: string;
  vehicleType: VehicleType | 'ALL';
  basePrice: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
}

export interface SparePartDto {
  id: string;
  supplierId?: string;
  supplierName?: string;
  partNumber: string;
  name: string;
  brand: string;
  vehicleType: VehicleType | 'UNIVERSAL';
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockAlert: number;
  unit: string;
  shelfLocation?: string;
  isActive: boolean;
}

export interface MechanicDto {
  id: string;
  userId: string;
  employeeId: string;
  fullName: string;
  phone?: string;
  specialization: MechanicSpecialization;
  status: MechanicStatus;
  activeWorkOrdersCount?: number;
  dailyTarget: number;
  rating: number;
}

export interface WorkOrderItemDto {
  id?: string;
  workOrderId?: string;
  itemType: ItemType;
  serviceId?: string;
  sparePartId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  mechanicCommission?: number;
  notes?: string;
}

export interface WorkOrderDto {
  id: string;
  woNumber: string;
  bookingId?: string;
  customerId: string;
  vehicleId: string;
  mechanicId?: string;
  entryMileage: number;
  complaint: string;
  initialDiagnosis?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  actualStart?: string;
  actualCompletion?: string;
  qcNotes?: string;
  qcPassed?: boolean;
  customer?: CustomerDto;
  vehicle?: VehicleDto;
  mechanic?: MechanicDto;
  items?: WorkOrderItemDto[];
  totalAmount?: number;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDto {
  id: string;
  bookingCode: string;
  customerId: string;
  vehicleId: string;
  vehicleType: VehicleType;
  preferredDate: string;
  preferredTimeSlot: string;
  serviceTypeNotes: string;
  status: BookingStatus;
  queueNumber: number;
  notes?: string;
  customer?: CustomerDto;
  vehicle?: VehicleDto;
  createdAt: string;
}

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  customerId: string;
  subtotalServices: number;
  subtotalParts: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  paidAmount?: number;
  customer?: CustomerDto;
  workOrder?: WorkOrderDto;
  payments?: PaymentDto[];
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  invoiceId: string;
  paymentNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paidAt: string;
  receivedById: string;
  notes?: string;
}

export interface DashboardSummaryDto {
  todayRevenue: number;
  yesterdayRevenue: number;
  revenueChangePercentage: number;
  activeQueueCount: number;
  todayCompletedCount: number;
  lowStockItemsCount: number;
  activeWorkOrdersCount: number;
  carVsMotorRatio: {
    cars: number;
    motorcycles: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
