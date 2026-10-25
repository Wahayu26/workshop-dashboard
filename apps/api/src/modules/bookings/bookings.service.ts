import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/create-booking.dto';
import { BookingStatus, WorkOrderStatus, WorkOrderPriority } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    date?: string;
    status?: BookingStatus;
    vehicleType?: string;
    search?: string;
  }) {
    const { date, status, vehicleType, search } = params;
    const where: any = {};

    if (date) {
      where.preferredDate = new Date(date);
    }

    if (status) {
      where.status = status;
    }

    if (vehicleType && vehicleType !== 'ALL') {
      where.vehicleType = vehicleType;
    }

    if (search) {
      where.OR = [
        { bookingCode: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
        { vehicle: { plateNumber: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.booking.findMany({
      where,
      orderBy: [{ preferredDate: 'asc' }, { queueNumber: 'asc' }],
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            brand: true,
            model: true,
            year: true,
            currentMileage: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            woNumber: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        workOrder: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Data booking antrian tidak ditemukan');
    }

    return booking;
  }

  async create(dto: CreateBookingDto) {
    const prefDate = new Date(dto.preferredDate);

    // Calculate queue number for the selected date
    const countToday = await this.prisma.booking.count({
      where: { preferredDate: prefDate },
    });
    const queueNumber = countToday + 1;

    // Generate unique booking code BKG-YYYYMMDD-01
    const dateStr = dto.preferredDate.replace(/-/g, '');
    const bookingCode = `BKG-${dateStr}-${String(queueNumber).padStart(2, '0')}`;

    return this.prisma.booking.create({
      data: {
        bookingCode,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        vehicleType: dto.vehicleType,
        preferredDate: prefDate,
        preferredTimeSlot: dto.preferredTimeSlot,
        serviceTypeNotes: dto.serviceTypeNotes,
        status: BookingStatus.CONFIRMED,
        queueNumber,
        notes: dto.notes,
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async convertToWorkOrder(id: string, createdById: string) {
    const booking = await this.findOne(id);

    if (booking.workOrder) {
      throw new ConflictException(
        `Booking ini sudah dikonversi menjadi Work Order (${booking.workOrder.woNumber})`,
      );
    }

    // Generate WO Number: WO-YYYYMMDD-001
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const countWO = await this.prisma.workOrder.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    const woNumber = `WO-${dateStr}-${String(countWO + 1).padStart(3, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Work Order
      const workOrder = await tx.workOrder.create({
        data: {
          woNumber,
          bookingId: booking.id,
          customerId: booking.customerId,
          vehicleId: booking.vehicleId,
          entryMileage: booking.vehicle.currentMileage || 0,
          complaint: booking.serviceTypeNotes,
          status: WorkOrderStatus.PENDING,
          priority: WorkOrderPriority.NORMAL,
          createdById,
        },
        include: {
          customer: true,
          vehicle: true,
        },
      });

      // 2. Update booking status to ARRIVED
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.ARRIVED },
      });

      return workOrder;
    });
  }
}
