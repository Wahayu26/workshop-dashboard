import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateServiceCategoryDto {
  @ApiProperty({ example: 'Tune Up & Servis Berkala' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'ALL', enum: ['CAR', 'MOTORCYCLE', 'ALL'] })
  @IsString()
  @IsOptional()
  vehicleType?: string;

  @ApiPropertyOptional({ example: 'Wrench' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class CreateServiceDto {
  @ApiProperty({ example: 'uuid-kategori' })
  @IsUUID('4', { message: 'Category ID harus berupa UUID' })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'SRV-MOB-010', description: 'Kode unik jasa servis' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Flushing Minyak Rem & Bleeding 4 Roda' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Keterangan teknis pekerjaan' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'CAR', enum: ['CAR', 'MOTORCYCLE', 'ALL'] })
  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @ApiProperty({ example: 150000, description: 'Tarif dasar jasa' })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ example: 45, description: 'Estimasi durasi pengerjaan dalam menit' })
  @IsInt()
  @Min(5)
  estimatedDurationMinutes: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateServiceDto extends CreateServiceDto {}
