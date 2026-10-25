import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface UpdateSettingsDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  taxPercentage?: number;
  currency?: string;
  operatingHours?: any;
  invoiceFooter?: string;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.workshopSetting.findFirst();

    if (!settings) {
      settings = await this.prisma.workshopSetting.create({
        data: {
          name: 'BengkelKu Motor & Mobil Center',
          address: 'Jl. Otomotif Raya No. 88, Jakarta Selatan, DKI Jakarta 12340',
          phone: '0812-9988-7766',
          email: 'support@bengkelku.id',
          taxPercentage: 11.0,
          currency: 'IDR',
          invoiceFooter: 'Terima kasih telah mempercayakan kendaraan Anda kepada BengkelKu. Garansi servis 14 hari atau 1.000 KM.',
          operatingHours: {
            weekdays: '08:00 - 17:00 WIB',
            saturday: '08:00 - 15:00 WIB',
            sunday: 'Libur (Tutup)',
          },
        },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const existing = await this.getSettings();

    return this.prisma.workshopSetting.update({
      where: { id: existing.id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.address && { address: dto.address }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.email && { email: dto.email }),
        ...(dto.taxPercentage !== undefined && { taxPercentage: dto.taxPercentage }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.operatingHours !== undefined && { operatingHours: dto.operatingHours }),
        ...(dto.invoiceFooter !== undefined && { invoiceFooter: dto.invoiceFooter }),
      },
    });
  }
}
