import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkOrderPriority, WorkOrderStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateWorkOrderDto {
  @ApiPropertyOptional({ description: 'ID Booking jika dibuat dari antrian' })
  @IsUUID('4')
  @IsOptional()
  bookingId?: string;

  @ApiProperty({ description: 'ID Pelanggan' })
  @IsUUID('4')
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'ID Kendaraan' })
  @IsUUID('4')
  @IsNotEmpty()
  vehicleId: string;

  @ApiPropertyOptional({ description: 'ID Mekanik penanggung jawab' })
  @IsUUID('4')
  @IsOptional()
  mechanicId?: string;

  @ApiProperty({ example: 45000, description: 'Kilometer odometer saat kendaraan masuk' })
  @IsInt()
  @Min(0)
  entryMileage: number;

  @ApiProperty({ example: 'Tarikan mesin tersendat saat tanjakan dan rem depan berdecit' })
  @IsString()
  @IsNotEmpty()
  complaint: string;

  @ApiPropertyOptional({ example: 'Kemungkinan throttle body kotor dan kampas rem aus' })
  @IsString()
  @IsOptional()
  initialDiagnosis?: string;

  @ApiPropertyOptional({ enum: WorkOrderPriority, default: WorkOrderPriority.NORMAL })
  @IsEnum(WorkOrderPriority)
  @IsOptional()
  priority?: WorkOrderPriority;
}

export class UpdateWorkOrderStatusDto {
  @ApiProperty({ enum: WorkOrderStatus, example: WorkOrderStatus.IN_PROGRESS })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;

  @ApiPropertyOptional({ description: 'ID Mekanik jika diassign/diubah saat ganti status' })
  @IsUUID('4')
  @IsOptional()
  mechanicId?: string;

  @ApiPropertyOptional({ example: 'Uji jalan halus, rem responsif, getaran mesin hilang' })
  @IsString()
  @IsOptional()
  qcNotes?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  qcPassed?: boolean;
}
