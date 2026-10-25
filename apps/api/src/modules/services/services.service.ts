import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
  CreateServiceCategoryDto,
} from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAllCategories() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { services: true } },
      },
    });
  }

  async createCategory(dto: CreateServiceCategoryDto) {
    return this.prisma.serviceCategory.create({
      data: dto,
    });
  }

  async findAllServices(params: {
    vehicleType?: string;
    categoryId?: string;
    search?: string;
    isActive?: boolean;
  }) {
    const { vehicleType, categoryId, search, isActive } = params;
    const where: any = {};

    if (vehicleType && vehicleType !== 'ALL') {
      where.OR = [{ vehicleType }, { vehicleType: 'ALL' }];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.service.findMany({
      where,
      orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!service) {
      throw new NotFoundException('Layanan servis tidak ditemukan');
    }

    return service;
  }

  async create(dto: CreateServiceDto) {
    const existing = await this.prisma.service.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Kode layanan [${dto.code}] sudah terdaftar`);
    }

    return this.prisma.service.create({
      data: {
        categoryId: dto.categoryId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        vehicleType: dto.vehicleType,
        basePrice: dto.basePrice,
        estimatedDurationMinutes: dto.estimatedDurationMinutes,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const service = await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }
}
