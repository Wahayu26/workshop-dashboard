import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StockMovementType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'PT Astra Otoparts Tbk' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Budi Cahyadi' })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional({ example: '021-4603930' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'sales@astra.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Kawasan Industri Pulogadung, Jakarta' })
  @IsString()
  @IsOptional()
  address?: string;
}

export class CreateSparePartDto {
  @ApiPropertyOptional({ description: 'ID Supplier' })
  @IsUUID('4')
  @IsOptional()
  supplierId?: string;

  @ApiProperty({ example: 'LUB-CAST-10W40', description: 'Nomor part unik' })
  @IsString()
  @IsNotEmpty()
  partNumber: string;

  @ApiProperty({ example: 'Castrol Magnatec Stop-Start 10W-40 (4L)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Castrol' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'CAR', enum: ['CAR', 'MOTORCYCLE', 'UNIVERSAL'] })
  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @ApiProperty({ example: 'Oli & Pelumas' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 290000, description: 'Harga Beli / HPP' })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ example: 380000, description: 'Harga Jual ke Pelanggan' })
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @ApiProperty({ example: 12, description: 'Jumlah stok fisik awal' })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 5, description: 'Batas stok minimum peringatan alert' })
  @IsInt()
  @Min(0)
  minStockAlert: number;

  @ApiProperty({ example: 'galon', description: 'Satuan unit (pcs, liter, set, botol)' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiPropertyOptional({ example: 'Rak A-03' })
  @IsString()
  @IsOptional()
  shelfLocation?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateSparePartDto extends CreateSparePartDto {}

export class StockAdjustmentDto {
  @ApiProperty({ enum: StockMovementType, example: StockMovementType.IN })
  @IsEnum(StockMovementType)
  type: StockMovementType;

  @ApiProperty({ example: 10, description: 'Jumlah penambahan/pengurangan' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 'Restock mingguan dari supplier' })
  @IsString()
  @IsOptional()
  notes?: string;
}
