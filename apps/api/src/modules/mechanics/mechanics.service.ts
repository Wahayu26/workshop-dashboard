import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { MechanicStatus, WorkOrderStatus } from '@prisma/client';

@Injectable()
export class MechanicsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const mechanics = await this.prisma.mechanic.findMany({
      orderBy: { employeeId: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        workOrders: {
          where: {
            status: {
              in: [WorkOrderStatus.DIAGNOSING, WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.QC],
            },
          },
          select: {
            id: true,
            woNumber: true,
            status: true,
            vehicle: {
              select: {
                plateNumber: true,
                model: true,
              },
            },
          },
        },
        _count: {
          select: {
            workOrders: true,
          },
        },
      },
    });

    return mechanics.map((m) => ({
      id: m.id,
      userId: m.userId,
      employeeId: m.employeeId,
      fullName: m.user.fullName,
      email: m.user.email,
      phone: m.user.phone,
      avatarUrl: m.user.avatarUrl,
      specialization: m.specialization,
      status: m.status,
      dailyTarget: m.dailyTarget,
      rating: Number(m.rating),
      activeWorkOrders: m.workOrders,
      activeWorkOrdersCount: m.workOrders.length,
      totalCompletedWorkOrders: m._count.workOrders - m.workOrders.length,
    }));
  }

  async findOne(id: string) {
    const m = await this.prisma.mechanic.findUnique({
      where: { id },
      include: {
        user: true,
        schedules: {
          orderBy: { shiftDate: 'desc' },
          take: 7,
        },
        workOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            vehicle: true,
          },
        },
      },
    });

    if (!m) {
      throw new NotFoundException('Data mekanik tidak ditemukan');
    }

    return m;
  }

  async update(id: string, dto: UpdateMechanicDto) {
    await this.findOne(id);
    return this.prisma.mechanic.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, status: MechanicStatus) {
    await this.findOne(id);
    return this.prisma.mechanic.update({
      where: { id },
      data: { status },
    });
  }
}
