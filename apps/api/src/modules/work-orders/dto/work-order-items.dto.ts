import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddWorkOrderItemDto {
  @ApiProperty({ enum: ItemType, example: ItemType.SERVICE })
  @IsEnum(ItemType)
  itemType: ItemType;

  @ApiPropertyOptional({ description: 'ID Jasa jika itemType adalah SERVICE' })
  @IsUUID('4')
  @IsOptional()
  serviceId?: string;

  @ApiPropertyOptional({ description: 'ID Sparepart jika itemType adalah SPARE_PART' })
  @IsUUID('4')
  @IsOptional()
  sparePartId?: string;

  @ApiProperty({ example: 'Jasa Tune Up Mesin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({ description: 'Catatan teknis item' })
  @IsString()
  @IsOptional()
  notes?: string;
}
