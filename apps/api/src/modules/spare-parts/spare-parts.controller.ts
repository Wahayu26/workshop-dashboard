import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SparePartsService } from './spare-parts.service';
import {
  CreateSparePartDto,
  UpdateSparePartDto,
  CreateSupplierDto,
  StockAdjustmentDto,
} from './dto/create-spare-part.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Spare Parts & Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Daftar inventori sparepart dengan filter kategori, tipe kendaraan & pencarian' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'vehicleType', required: false, enum: ['CAR', 'MOTORCYCLE', 'UNIVERSAL'] })
  @ApiQuery({ name: 'lowStockOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('category') category?: string,
    @Query('vehicleType') vehicleType?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.sparePartsService.findAll({
      category,
      vehicleType,
      lowStockOnly: lowStockOnly === 'true',
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('low-stock')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Daftar suku cadang yang stoknya berada di bawah batas minimum (Alert)' })
  findLowStock() {
    return this.sparePartsService.findLowStock();
  }

  @Get('suppliers')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Daftar supplier suku cadang bengkel' })
  findSuppliers() {
    return this.sparePartsService.findAllSuppliers();
  }

  @Post('suppliers')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah data supplier baru' })
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.sparePartsService.createSupplier(dto);
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Detail suku cadang & riwayat pergerakan stok' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sparePartsService.findOne(id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah suku cadang baru ke inventori' })
  create(@Body() dto: CreateSparePartDto) {
    return this.sparePartsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Update informasi suku cadang / harga' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSparePartDto,
  ) {
    return this.sparePartsService.update(id, dto);
  }

  @Post(':id/adjust')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Penyesuaian stok (masuk barang / restock / penyesuaian fisik opname)' })
  adjustStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: StockAdjustmentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.sparePartsService.adjustStock(id, dto, userId);
  }
}
