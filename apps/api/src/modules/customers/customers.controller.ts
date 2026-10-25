import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create-customer.dto';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Customers & Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Daftar pelanggan beserta ringkasan kendaraan' })
  @ApiQuery({ name: 'search', required: false, description: 'Cari nama, HP, email, atau plat nomor' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.customersService.findAll({
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('vehicles/lookup/:plate')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Cari data kendaraan langsung berdasarkan nomor plat polisi' })
  findVehicleByPlate(@Param('plate') plate: string) {
    return this.customersService.findVehicleByPlate(plate);
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Detail lengkap pelanggan dan daftar seluruh kendaraannya' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Tambah pelanggan baru' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Update informasi pelanggan' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Hapus pelanggan (Hanya Owner/Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }

  @Post(':id/vehicles')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Tambah kendaraan baru untuk pelanggan tertentu' })
  addVehicle(
    @Param('id', ParseUUIDPipe) customerId: string,
    @Body() dto: CreateVehicleDto,
  ) {
    return this.customersService.addVehicle(customerId, dto);
  }

  @Patch('vehicles/:vehicleId')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Update detail data kendaraan' })
  updateVehicle(
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.customersService.updateVehicle(vehicleId, dto);
  }
}
