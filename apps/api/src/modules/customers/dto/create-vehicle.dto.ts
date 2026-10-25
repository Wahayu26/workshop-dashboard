import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR, description: 'Jenis kendaraan (CAR atau MOTORCYCLE)' })
  @IsEnum(VehicleType, { message: 'Jenis kendaraan harus CAR atau MOTORCYCLE' })
  vehicleType: VehicleType;

  @ApiProperty({ example: 'B 1234 SAK', description: 'Nomor plat polisi (unik)' })
  @IsString()
  @IsNotEmpty({ message: 'Nomor plat polisi wajib diisi' })
  plateNumber: string;

  @ApiProperty({ example: 'Toyota', description: 'Merk kendaraan (Toyota, Honda, Yamaha, dll)' })
  @IsString()
  @IsNotEmpty({ message: 'Merk kendaraan wajib diisi' })
  brand: string;

  @ApiProperty({ example: 'Avanza 1.5 Veloz', description: 'Model/tipe kendaraan' })
  @IsString()
  @IsNotEmpty({ message: 'Model kendaraan wajib diisi' })
  model: string;

  @ApiProperty({ example: 2022, description: 'Tahun pembuatan kendaraan' })
  @IsInt({ message: 'Tahun harus berupa bilangan bulat' })
  @Min(1980, { message: 'Tahun minimal 1980' })
  year: number;

  @ApiPropertyOptional({ example: 'Hitam Metalik' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 'AUTOMATIC' })
  @IsString()
  @IsOptional()
  transmission?: string;

  @ApiPropertyOptional({ example: 45000, description: 'Kilometer saat ini' })
  @IsInt()
  @Min(0)
  @IsOptional()
  currentMileage?: number;

  @ApiPropertyOptional({ description: 'Nomor rangka / VIN' })
  @IsString()
  @IsOptional()
  vinNumber?: string;

  @ApiPropertyOptional({ description: 'Nomor mesin' })
  @IsString()
  @IsOptional()
  engineNumber?: string;

  @ApiPropertyOptional({ description: 'Catatan tambahan kendaraan' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateVehicleDto extends CreateVehicleDto {}
