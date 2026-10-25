import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty({ example: 783000, description: 'Nominal uang yang dibayarkan' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH, description: 'Metode pembayaran (CASH, BANK_TRANSFER, QRIS, DEBIT_CARD, CREDIT_CARD)' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'TRX-BCA-981249', description: 'Nomor referensi / approval code transaksi non-tunai' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ example: 'Pembayaran tunai lunas, uang pas' })
  @IsString()
  @IsOptional()
  notes?: string;
}
