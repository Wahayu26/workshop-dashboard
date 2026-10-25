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
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BookingStatus, Role } from '@prisma/client';

@ApiTags('Booking & Queue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Daftar booking servis & antrian harian' })
  @ApiQuery({ name: 'date', required: false, description: 'Format YYYY-MM-DD' })
  @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
  @ApiQuery({ name: 'vehicleType', required: false, enum: ['CAR', 'MOTORCYCLE', 'ALL'] })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('date') date?: string,
    @Query('status') status?: BookingStatus,
    @Query('vehicleType') vehicleType?: string,
    @Query('search') search?: string,
  ) {
    return this.bookingsService.findAll({
      date,
      status,
      vehicleType,
      search,
    });
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC, Role.CUSTOMER)
  @ApiOperation({ summary: 'Detail tiket booking antrian' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.CUSTOMER)
  @ApiOperation({ summary: 'Buat janji / booking servis baru' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Patch(':id/status')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Update status tiket booking (CONFIRMED / ARRIVED / CANCELLED)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto.status);
  }

  @Post(':id/convert-to-wo')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Konversi tiket booking kedatangan menjadi Surat Perintah Kerja (SPK) aktif' })
  convertToWorkOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingsService.convertToWorkOrder(id, userId);
  }
}
