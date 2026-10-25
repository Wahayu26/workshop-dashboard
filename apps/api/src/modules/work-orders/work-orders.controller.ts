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
import { WorkOrdersService } from './work-orders.service';
import {
  CreateWorkOrderDto,
  UpdateWorkOrderStatusDto,
} from './dto/create-work-order.dto';
import { AddWorkOrderItemDto } from './dto/work-order-items.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, WorkOrderStatus } from '@prisma/client';

@ApiTags('Work Orders (SPK)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Daftar semua Work Order (SPK) dengan filter status alur kerja' })
  @ApiQuery({ name: 'status', enum: WorkOrderStatus, required: false })
  @ApiQuery({ name: 'mechanicId', required: false })
  @ApiQuery({ name: 'vehicleType', required: false, enum: ['CAR', 'MOTORCYCLE', 'ALL'] })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('status') status?: WorkOrderStatus,
    @Query('mechanicId') mechanicId?: string,
    @Query('vehicleType') vehicleType?: string,
    @Query('search') search?: string,
  ) {
    return this.workOrdersService.findAll({
      status,
      mechanicId,
      vehicleType,
      search,
    });
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Detail Work Order lengkap dengan item jasa, sparepart & invoice' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Buat SPK / Work Order baru saat kendaraan masuk' })
  create(
    @Body() dto: CreateWorkOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.workOrdersService.create(dto, userId);
  }

  @Patch(':id/status')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Update status tahapan SPK (Menunggu → Diagnosa → Dikerjakan → QC → Selesai)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkOrderStatusDto,
  ) {
    return this.workOrdersService.updateStatus(id, dto);
  }

  @Post(':id/items')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Tambahkan item pekerjaan (jasa servis atau sparepart) ke SPK' })
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddWorkOrderItemDto,
  ) {
    return this.workOrdersService.addItem(id, dto);
  }

  @Delete(':id/items/:itemId')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Hapus item pekerjaan dari SPK' })
  removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.workOrdersService.removeItem(id, itemId);
  }

  @Patch(':id/assign-mechanic')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Tugaskan mekanik ke SPK' })
  assignMechanic(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('mechanicId', ParseUUIDPipe) mechanicId: string,
  ) {
    return this.workOrdersService.assignMechanic(id, mechanicId);
  }
}
