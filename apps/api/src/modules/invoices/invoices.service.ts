import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import {
  PaymentStatus,
  ItemType,
  StockMovementType,
  WorkOrderStatus,
  MechanicStatus,
} from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    status?: PaymentStatus;
    customerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, customerId, search, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.paymentStatus = status;
    }
    if (customerId) {
      where.customerId = customerId;
    }
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
        { workOrder: { woNumber: { contains: search, mode: 'insensitive' } } },
        { workOrder: { vehicle: { plateNumber: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, fullName: true, phone: true },
          },
          workOrder: {
            select: {
              id: true,
              woNumber: true,
              vehicle: {
                select: {
                  plateNumber: true,
                  brand: true,
                  model: true,
                  vehicleType: true,
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              paymentMethod: true,
              paidAt: true,
            },
          },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        workOrder: {
          include: {
            vehicle: true,
            mechanic: {
              include: { user: { select: { fullName: true } } },
            },
            items: {
              include: {
                service: true,
                sparePart: true,
              },
            },
          },
        },
        payments: {
          orderBy: { paidAt: 'desc' },
          include: {
            receivedBy: {
              select: { id: true, fullName: true },
            },
          },
        },
        createdBy: {
          select: { id: true, fullName: true },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice tagihan tidak ditemukan');
    }

    return invoice;
  }

  async createFromWorkOrder(dto: CreateInvoiceDto, createdById: string) {
    const wo = await this.prisma.workOrder.findUnique({
      where: { id: dto.workOrderId },
      include: {
        items: true,
        invoice: true,
      },
    });

    if (!wo) {
      throw new NotFoundException('Work Order tidak ditemukan');
    }

    if (wo.invoice) {
      throw new ConflictException(
        `Invoice sudah pernah diterbitkan untuk SPK ini (${wo.invoice.invoiceNumber})`,
      );
    }

    // Calculate subtotal services and parts
    const subtotalServices = wo.items
      .filter((i) => i.itemType === ItemType.SERVICE)
      .reduce((sum, i) => sum + Number(i.totalPrice), 0);

    const subtotalParts = wo.items
      .filter((i) => i.itemType === ItemType.SPARE_PART)
      .reduce((sum, i) => sum + Number(i.totalPrice), 0);

    const discountAmount = dto.discountAmount || 0;
    const taxableAmount = Math.max(0, subtotalServices + subtotalParts - discountAmount);

    const taxPercentage = dto.taxPercentage !== undefined ? dto.taxPercentage : 11.0;
    const taxAmount = (taxableAmount * taxPercentage) / 100;
    const totalAmount = taxableAmount + taxAmount;

    // Generate Invoice Number: INV-YYYYMMDD-001
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const countToday = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    const invoiceNumber = `INV-${dateStr}-${String(countToday + 1).padStart(3, '0')}`;

    const dueDate = dto.dueDate ? new Date(dto.dueDate) : today;

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        workOrderId: wo.id,
        customerId: wo.customerId,
        subtotalServices,
        subtotalParts,
        discountAmount,
        taxPercentage,
        taxAmount,
        totalAmount,
        paymentStatus: PaymentStatus.UNPAID,
        dueDate,
        notes: dto.notes,
        createdById,
      },
      include: {
        customer: true,
        workOrder: {
          include: {
            vehicle: true,
            items: true,
          },
        },
      },
    });
  }

  async recordPayment(invoiceId: string, dto: RecordPaymentDto, receivedById: string) {
    const invoice = await this.findOne(invoiceId);

    if (invoice.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Invoice ini sudah lunas');
    }

    // Calculate current total paid
    const currentPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const newTotalPaid = currentPaid + dto.amount;
    const totalDue = Number(invoice.totalAmount);

    const isFullyPaid = newTotalPaid >= totalDue;
    const nextStatus = isFullyPaid
      ? PaymentStatus.PAID
      : newTotalPaid > 0
      ? PaymentStatus.PARTIAL
      : PaymentStatus.UNPAID;

    // Generate Payment Number: PAY-YYYYMMDD-XXX-1
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const paymentNumber = `PAY-${dateStr}-${invoice.invoiceNumber.slice(-3)}-${invoice.payments.length + 1}`;

    // Execute atomic DB transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Record payment
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          paymentNumber,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          referenceNumber: dto.referenceNumber,
          notes: dto.notes,
          receivedById,
        },
      });

      // 2. Update invoice status
      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: { paymentStatus: nextStatus },
        include: {
          customer: true,
          workOrder: {
            include: { vehicle: true, items: true },
          },
          payments: true,
        },
      });

      // 3. If invoice is fully paid, deduct spare parts stock atomically and mark WO as PAID
      if (isFullyPaid) {
        // Update Work Order status to PAID
        await tx.workOrder.update({
          where: { id: invoice.workOrderId },
          data: { status: WorkOrderStatus.PAID },
        });

        // Deduct spare parts inventory
        for (const it of invoice.workOrder.items) {
          if (it.itemType === ItemType.SPARE_PART && it.sparePartId) {
            const part = await tx.sparePart.findUnique({
              where: { id: it.sparePartId },
            });

            if (part) {
              const newQty = Math.max(0, part.stockQuantity - it.quantity);
              await tx.sparePart.update({
                where: { id: it.sparePartId },
                data: { stockQuantity: newQty },
              });

              // Log stock movement
              await tx.stockMovement.create({
                data: {
                  sparePartId: it.sparePartId,
                  type: StockMovementType.OUT_WORK_ORDER,
                  quantity: it.quantity,
                  referenceId: invoice.invoiceNumber,
                  notes: `Pemakaian pada SPK ${invoice.workOrder.woNumber} (${it.name})`,
                  createdById: receivedById,
                },
              });
            }
          }
        }
      }

      return {
        payment,
        invoice: updatedInvoice,
        isFullyPaid,
      };
    });
  }
}
