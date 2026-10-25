import { ApiPropertyOptional } from '@nestjs/swagger';
import { MechanicSpecialization, MechanicStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMechanicDto {
  @ApiPropertyOptional({ enum: MechanicSpecialization })
  @IsEnum(MechanicSpecialization)
  @IsOptional()
  specialization?: MechanicSpecialization;

  @ApiPropertyOptional({ enum: MechanicStatus })
  @IsEnum(MechanicStatus)
  @IsOptional()
  status?: MechanicStatus;

  @ApiPropertyOptional({ example: 6 })
  @IsInt()
  @Min(1)
  @IsOptional()
  dailyTarget?: number;

  @ApiPropertyOptional({ example: 4.9 })
  @IsNumber()
  @IsOptional()
  rating?: number;
}
