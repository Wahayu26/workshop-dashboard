import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MechanicsService } from './mechanics.service';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MechanicStatus, Role } from '@prisma/client';

@ApiTags('Mechanics & Workload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Daftar semua mekanik beserta beban kerja SPK aktif dan status kehadiran' })
  findAll() {
    return this.mechanicsService.findAll();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER, Role.MECHANIC)
  @ApiOperation({ summary: 'Detail mekanik, jadwal kerja, dan riwayat pekerjaan' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mechanicsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Update spesialisasi, target harian, atau rating mekanik' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMechanicDto,
  ) {
    return this.mechanicsService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(Role.OWNER, Role.ADMIN, Role.MECHANIC)
  @ApiOperation({ summary: 'Update status ketersediaan mekanik (AVAILABLE / BUSY / OFF_DUTY)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: MechanicStatus,
  ) {
    return this.mechanicsService.updateStatus(id, status);
  }
}
