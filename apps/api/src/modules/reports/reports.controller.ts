import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Reports & Analytics')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get workshop revenue statistics' })
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  async getRevenueStats(@Query('period') period?: '7days' | 'month' | 'year') {
    return this.reportsService.getRevenueStats(period);
  }

  @Get('top-services')
  @ApiOperation({ summary: 'Get most demanded services' })
  @Roles(Role.OWNER, Role.ADMIN)
  async getTopServices() {
    return this.reportsService.getTopServices();
  }

  @Get('top-spare-parts')
  @ApiOperation({ summary: 'Get best selling spare parts' })
  @Roles(Role.OWNER, Role.ADMIN)
  async getTopSpareParts() {
    return this.reportsService.getTopSpareParts();
  }

  @Get('ratios')
  @ApiOperation({ summary: 'Get vehicle and payment method distribution' })
  @Roles(Role.OWNER, Role.ADMIN, Role.CASHIER)
  async getVehicleAndPaymentRatio() {
    return this.reportsService.getVehicleAndPaymentRatio();
  }
}
