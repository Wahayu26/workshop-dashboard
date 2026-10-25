import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Suryadi Pratama', description: 'Nama lengkap pelanggan' })
  @IsString()
  @IsNotEmpty({ message: 'Nama pelanggan wajib diisi' })
  fullName: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor telepon / WhatsApp' })
  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  phone: string;

  @ApiPropertyOptional({ example: 'suryadi@gmail.com', description: 'Alamat email' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Jl. Surya Sumantri No. 12, Bandung', description: 'Alamat rumah' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Catatan tambahan terkait pelanggan' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCustomerDto extends CreateCustomerDto {}
