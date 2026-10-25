import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateWorkOrderDto,
  UpdateWorkOrderStatusDto,
} from './dto/create-work-order.dto';
import { AddWorkOrderItemDto } from './dto/work-order-items.dto';
import { WorkOrderStatus, MechanicStatus, ItemType } from '@prisma/client';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    status?: WorkOrderStatus;
    mechanicId?: string;
    vehicleType?: string;
    search?: string;
  }) {
    const { status, mechanicId, vehicleType, search } = params;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (mechanicId) {
      where.mechanicId = mechanicId;
    }

    if (vehicleType && vehicleType !== 'ALL') {
      where.vehicle = { vehicleType };
    }

    if (search) {
      where.OR = [
        { woNumber: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { vehicle: { plateNumber: { contains: search, mode: 'insensitive' } } },
        { complaint: { contains: search, mode: 'insensitive' } },
      ];
    }

    const workOrders = await this.prisma.workOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vehicleType: true,
            plateNumber: true,
            brand: true,
            model: true,
            year: true,
            currentMileage: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            employeeId: true,
            specialization: true,
            user: { select: { fullName: true } },
          },
        },
        items: true,
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            paymentStatus: true,
          },
        },
      },
    });

    return workOrders.map((wo) => {
      const subtotalServices = wo.items
        .filter((i) => i.itemType === ItemType.SERVICE)
        .reduce((sum, i) => sum + Number(i.totalPrice), 0);

      const subtotalParts = wo.items
        .filter((i) => i.itemType === ItemType.SPARE_PART)
        .reduce((sum, i) => sum + Number(i.totalPrice), 0);

      return {
        ...wo,
        subtotalServices,
        subtotalParts,
        totalAmount: subtotalServices + subtotalParts,
      };
    });
  }

  async findOne(id: string) {
    const wo = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        mechanic: {
          include: {
            user: {
              select: { fullName: true, phone: true, email: true },
            },
          },
        },
        items: {
          orderBy: { itemType: 'asc' },
          include: {
            service: true,
            sparePart: true,
          },
        },
        invoice: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!wo) {
      throw new NotFoundException('Work Order / SPK tidak ditemukan');
    }

    const subtotalServices = wo.items
      .filter((i) => i.itemType === ItemType.SERVICE)
      .reduce((sum, i) => sum + Number(i.totalPrice), 0);

    const subtotalParts = wo.items
      .filter((i) => i.itemType === ItemType.SPARE_PART)
      .reduce((sum, i) => sum + Number(i.totalPrice), 0);

    return {
      ...wo,
      subtotalServices,
      subtotalParts,
      totalAmount: subtotalServices + subtotalParts,
    };
  }

  async create(dto: CreateWorkOrderDto, createdById: string) {
    // Generate WO number: WO-YYYYMMDD-XXX
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

    return this.prisma.workOrder.create({
      data: {
        woNumber,
        bookingId: dto.bookingId || null,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        mechanicId: dto.mechanicId || null,
        entryMileage: dto.entryMileage,
        complaint: dto.complaint,
        initialDiagnosis: dto.initialDiagnosis,
        priority: dto.priority || 'NORMAL',
        status: WorkOrderStatus.PENDING,
        createdById,
      },
      include: {
        customer: true,
        vehicle: true,
        mechanic: {
          include: { user: { select: { fullName: true } } },
        },
      },
    });
  }

  async updateStatus(id: string, dto: UpdateWorkOrderStatusDto) {
    const wo = await this.findOne(id);
    const updateData: any = { status: dto.status };

    if (dto.mechanicId) {
      updateData.mechanicId = dto.mechanicId;
    }

    if (dto.qcNotes !== undefined) {
      updateData.qcNotes = dto.qcNotes;
    }

    if (dto.qcPassed !== undefined) {
      updateData.qcPassed = dto.qcPassed;
    }

    // Status Transitions
    if (dto.status === WorkOrderStatus.IN_PROGRESS && !wo.actualStart) {
      updateData.actualStart = new Date();
    }

    if (dto.status === WorkOrderStatus.COMPLETED && !wo.actualCompletion) {
      updateData.actualCompletion = new Date();
      // Update vehicle odometer and last service date
      await this.prisma.vehicle.update({
        where: { id: wo.vehicleId },
        data: {
          currentMileage: wo.entryMileage,
          lastServiceDate: new Date(),
        },
      });
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        vehicle: true,
        mechanic: {
          include: { user: { select: { fullName: true } } },
        },
        items: true,
      },
    });
  }

  async addItem(workOrderId: string, dto: AddWorkOrderItemDto) {
    await this.findOne(workOrderId);

    const discount = dto.discount || 0;
    const totalPrice = dto.unitPrice * dto.quantity - discount;

    return this.prisma.workOrderItem.create({
      data: {
        workOrderId,
        itemType: dto.itemType,
        serviceId: dto.serviceId || null,
        sparePartId: dto.sparePartId || null,
        name: dto.name,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        discount,
        totalPrice: Math.max(0, totalPrice),
        notes: dto.notes,
      },
    });
  }

  async removeItem(workOrderId: string, itemId: string) {
    const item = await this.prisma.workOrderItem.findFirst({
      where: { id: itemId, workOrderId },
    });

    if (!item) {
      throw new NotFoundException('Item pekerjaan tidak ditemukan');
    }

    return this.prisma.workOrderItem.delete({
      where: { id: itemId },
    });
  }

  async assignMechanic(workOrderId: string, mechanicId: string) {
    await this.findOne(workOrderId);

    return this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: { mechanicId },
      include: {
        mechanic: {
          include: { user: { select: { fullName: true } } },
        },
      },
    });
  }
}
