import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, VehicleType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID Pelanggan' })
  @IsUUID('4')
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'ID Kendaraan' })
  @IsUUID('4')
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({ example: '2026-10-25', description: 'Tanggal booking (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  preferredDate: string;

  @ApiProperty({ example: '09:00 - 10:00', description: 'Slot jam kedatangan' })
  @IsString()
  @IsNotEmpty()
  preferredTimeSlot: string;

  @ApiProperty({ example: 'Ganti oli rutin 10.000 km dan tune up mesin', description: 'Rincian keluhan atau jenis servis' })
  @IsString()
  @IsNotEmpty()
  serviceTypeNotes: string;

  @ApiPropertyOptional({ example: 'Pelanggan minta diselesaikan sebelum siang' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
