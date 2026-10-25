import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService, UpdateSettingsDto } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Workshop Settings')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get workshop profile and configuration' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @ApiOperation({ summary: 'Update workshop settings' })
  @Roles(Role.OWNER, Role.ADMIN)
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
