import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentStatus, Role } from '@prisma/client';

@ApiTags('Cashier & Invoices (POS)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.CUSTOMER)
  @ApiOperation({ summary: 'Daftar invoice dan riwayat transaksi kasir' })
  @ApiQuery({ name: 'status', enum: PaymentStatus, required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('status') status?: PaymentStatus,
    @Query('customerId') customerId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invoicesService.findAll({
      status,
      customerId,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.CUSTOMER)
  @ApiOperation({ summary: 'Rincian lengkap invoice, breakdown PPN & riwayat pembayaran' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.findOne(id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Terbitkan invoice baru dari Work Order (SPK) yang selesai' })
  create(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.invoicesService.createFromWorkOrder(dto, userId);
  }

  @Post(':id/payments')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Catat pembayaran kasir (Tunai / Transfer / QRIS) dan potong stok sparepart otomatis' })
  recordPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecordPaymentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.invoicesService.recordPayment(id, dto, userId);
  }
}
