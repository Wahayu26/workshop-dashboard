import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiPropertyOptional({ description: 'Refresh token jika tidak menggunakan cookie' })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
