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
import { ServicesService } from './services.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
  CreateServiceCategoryDto,
} from './dto/create-service.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Services & Pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('categories')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Daftar kategori layanan servis' })
  findCategories() {
    return this.servicesService.findAllCategories();
  }

  @Post('categories')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah kategori layanan baru' })
  createCategory(@Body() dto: CreateServiceCategoryDto) {
    return this.servicesService.createCategory(dto);
  }

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Katalog jasa & tarif servis (dengan filter Mobil/Motor)' })
  @ApiQuery({ name: 'vehicleType', required: false, enum: ['CAR', 'MOTORCYCLE', 'ALL'] })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('vehicleType') vehicleType?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.servicesService.findAllServices({
      vehicleType,
      categoryId,
      search,
    });
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Detail jasa servis' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah item jasa servis baru' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Update tarif atau rincian jasa servis' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Hapus jasa servis' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(':id/toggle')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Aktifkan/nonaktifkan status jasa servis' })
  toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.toggleActive(id);
  }
}
