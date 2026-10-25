import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID Work Order (SPK) yang diselesaikan' })
  @IsUUID('4')
  @IsNotEmpty()
  workOrderId: string;

  @ApiPropertyOptional({ example: 0, description: 'Potongan diskon kustom' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({ example: 11.0, description: 'Persentase pajak PPN (default 11%)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxPercentage?: number;

  @ApiPropertyOptional({ example: '2026-10-25', description: 'Jatuh tempo pembayaran' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Catatan tambahan di invoice' })
  @IsString()
  @IsOptional()
  notes?: string;
}
