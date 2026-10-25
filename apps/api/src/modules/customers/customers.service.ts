import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create-customer.dto';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        {
          vehicles: {
            some: {
              plateNumber: { contains: search.toUpperCase().replace(/\s+/g, ''), mode: 'insensitive' },
            },
          },
        },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicles: {
            select: {
              id: true,
              vehicleType: true,
              plateNumber: true,
              brand: true,
              model: true,
              year: true,
              currentMileage: true,
              lastServiceDate: true,
            },
          },
          _count: {
            select: {
              vehicles: true,
              workOrders: true,
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
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: {
          orderBy: { createdAt: 'desc' },
        },
        workOrders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            woNumber: true,
            status: true,
            complaint: true,
            createdAt: true,
            vehicle: {
              select: {
                plateNumber: true,
                model: true,
              },
            },
            invoice: {
              select: {
                totalAmount: true,
                paymentStatus: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Pelanggan tidak ditemukan');
    }

    return customer;
  }

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        notes: dto.notes,
      },
      include: {
        vehicles: true,
      },
    });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  // --- Vehicle Management ---
  async addVehicle(customerId: string, dto: CreateVehicleDto) {
    await this.findOne(customerId);

    const formattedPlate = dto.plateNumber.toUpperCase().trim();
    const existing = await this.prisma.vehicle.findUnique({
      where: { plateNumber: formattedPlate },
    });

    if (existing) {
      throw new ConflictException(
        `Kendaraan dengan plat nomor [${formattedPlate}] sudah terdaftar di sistem!`,
      );
    }

    return this.prisma.vehicle.create({
      data: {
        customerId,
        vehicleType: dto.vehicleType,
        plateNumber: formattedPlate,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        color: dto.color,
        transmission: dto.transmission || 'AUTOMATIC',
        currentMileage: dto.currentMileage || 0,
        vinNumber: dto.vinNumber,
        engineNumber: dto.engineNumber,
        notes: dto.notes,
      },
    });
  }

  async updateVehicle(vehicleId: string, dto: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException('Kendaraan tidak ditemukan');
    }

    const formattedPlate = dto.plateNumber ? dto.plateNumber.toUpperCase().trim() : vehicle.plateNumber;

    if (formattedPlate !== vehicle.plateNumber) {
      const existing = await this.prisma.vehicle.findUnique({
        where: { plateNumber: formattedPlate },
      });
      if (existing) {
        throw new ConflictException(`Plat nomor [${formattedPlate}] sudah digunakan kendaraan lain`);
      }
    }

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...dto,
        plateNumber: formattedPlate,
      },
    });
  }

  async findVehicleByPlate(plateNumber: string) {
    const formattedPlate = plateNumber.toUpperCase().trim();
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plateNumber: formattedPlate },
      include: {
        customer: true,
        workOrders: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Kendaraan dengan plat [${formattedPlate}] tidak ditemukan`);
    }

    return vehicle;
  }
}
