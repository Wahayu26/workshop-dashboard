import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateSparePartDto,
  UpdateSparePartDto,
  CreateSupplierDto,
  StockAdjustmentDto,
} from './dto/create-spare-part.dto';
import { StockMovementType } from '@prisma/client';

@Injectable()
export class SparePartsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    category?: string;
    vehicleType?: string;
    lowStockOnly?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, vehicleType, lowStockOnly, search, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (vehicleType && vehicleType !== 'UNIVERSAL') {
      where.OR = [{ vehicleType }, { vehicleType: 'UNIVERSAL' }];
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { partNumber: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Prisma doesn't support comparing two columns directly in where object easily without raw SQL or post-filter,
    // but we can query records and filter if lowStockOnly is true.
    const [total, parts] = await Promise.all([
      this.prisma.sparePart.count({ where }),
      this.prisma.sparePart.findMany({
        where,
        skip: lowStockOnly ? 0 : skip,
        take: lowStockOnly ? 200 : limit,
        orderBy: { name: 'asc' },
        include: {
          supplier: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
    ]);

    let resultData = parts;
    if (lowStockOnly) {
      resultData = parts.filter((p) => p.stockQuantity <= p.minStockAlert);
    }

    return {
      data: resultData,
      meta: {
        total: lowStockOnly ? resultData.length : total,
        page,
        limit,
        totalPages: Math.ceil((lowStockOnly ? resultData.length : total) / limit),
      },
    };
  }

  async findLowStock() {
    const all = await this.prisma.sparePart.findMany({
      where: { isActive: true },
      include: {
        supplier: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    return all.filter((p) => p.stockQuantity <= p.minStockAlert);
  }

  async findOne(id: string) {
    const part = await this.prisma.sparePart.findUnique({
      where: { id },
      include: {
        supplier: true,
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!part) {
      throw new NotFoundException('Suku cadang / sparepart tidak ditemukan');
    }

    return part;
  }

  async create(dto: CreateSparePartDto) {
    const existing = await this.prisma.sparePart.findUnique({
      where: { partNumber: dto.partNumber },
    });

    if (existing) {
      throw new ConflictException(`Nomor part [${dto.partNumber}] sudah terdaftar`);
    }

    return this.prisma.sparePart.create({
      data: {
        supplierId: dto.supplierId || null,
        partNumber: dto.partNumber,
        name: dto.name,
        brand: dto.brand,
        vehicleType: dto.vehicleType,
        category: dto.category,
        purchasePrice: dto.purchasePrice,
        sellingPrice: dto.sellingPrice,
        stockQuantity: dto.stockQuantity,
        minStockAlert: dto.minStockAlert,
        unit: dto.unit,
        shelfLocation: dto.shelfLocation,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
      include: { supplier: true },
    });
  }

  async update(id: string, dto: UpdateSparePartDto) {
    await this.findOne(id);

    return this.prisma.sparePart.update({
      where: { id },
      data: {
        supplierId: dto.supplierId || null,
        partNumber: dto.partNumber,
        name: dto.name,
        brand: dto.brand,
        vehicleType: dto.vehicleType,
        category: dto.category,
        purchasePrice: dto.purchasePrice,
        sellingPrice: dto.sellingPrice,
        stockQuantity: dto.stockQuantity,
        minStockAlert: dto.minStockAlert,
        unit: dto.unit,
        shelfLocation: dto.shelfLocation,
        isActive: dto.isActive,
      },
      include: { supplier: true },
    });
  }

  async adjustStock(id: string, dto: StockAdjustmentDto, userId?: string) {
    const part = await this.findOne(id);

    let newStock = part.stockQuantity;
    if (dto.type === StockMovementType.IN || dto.type === StockMovementType.RETURN) {
      newStock += dto.quantity;
    } else {
      if (part.stockQuantity < dto.quantity) {
        throw new BadRequestException(
          `Stok tidak mencukupi untuk pengurangan (Tersedia: ${part.stockQuantity})`,
        );
      }
      newStock -= dto.quantity;
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedPart = await tx.sparePart.update({
        where: { id },
        data: { stockQuantity: newStock },
      });

      await tx.stockMovement.create({
        data: {
          sparePartId: id,
          type: dto.type,
          quantity: dto.quantity,
          notes: dto.notes,
          createdById: userId,
        },
      });

      return updatedPart;
    });
  }

  // --- Suppliers ---
  async findAllSuppliers() {
    return this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { spareParts: true } },
      },
    });
  }

  async createSupplier(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: dto,
    });
  }
}
