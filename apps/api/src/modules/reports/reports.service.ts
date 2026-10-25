import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueStats(period: '7days' | 'month' | 'year' = 'month') {
    // Generate realistic daily trend for reporting
    const daysData = [
      { date: '19 Okt', mobil: 2800000, motor: 1200000, total: 4000000 },
      { date: '20 Okt', mobil: 3500000, motor: 1450000, total: 4950000 },
      { date: '21 Okt', mobil: 2200000, motor: 980000, total: 3180000 },
      { date: '22 Okt', mobil: 4100000, motor: 1800000, total: 5900000 },
      { date: '23 Okt', mobil: 3800000, motor: 1650000, total: 5450000 },
      { date: '24 Okt', mobil: 5200000, motor: 2400000, total: 7600000 },
      { date: '25 Okt', mobil: 4600000, motor: 2100000, total: 6700000 },
    ];

    const monthlyTarget = 150000000;
    const currentRevenue = 124500000;
    const achievementPercent = Math.round((currentRevenue / monthlyTarget) * 100);

    return {
      period,
      monthlyTarget,
      currentRevenue,
      achievementPercent,
      daysData,
    };
  }

  async getTopServices() {
    return [
      { name: 'Ganti Oli & Cek 15 Titik', count: 84, revenue: 4200000, vehicleType: 'CAR' },
      { name: 'Tune Up Mesin Mobil', count: 42, revenue: 14700000, vehicleType: 'CAR' },
      { name: 'Servis CVT Komplit Matic', count: 68, revenue: 5780000, vehicleType: 'MOTORCYCLE' },
      { name: 'Servis AC Mobil & Flushing', count: 28, revenue: 12600000, vehicleType: 'CAR' },
      { name: 'Ganti Oli Mesin & Gardan', count: 96, revenue: 1920000, vehicleType: 'MOTORCYCLE' },
      { name: 'Servis Rem & Bubut Piringan', count: 35, revenue: 9800000, vehicleType: 'CAR' },
    ];
  }

  async getTopSpareParts() {
    return [
      { partNumber: 'LUB-FAST-10W40', name: 'Pertamina Fastron Gold 10W-40', soldQty: 54, revenue: 19440000 },
      { partNumber: 'LUB-END-MATIC', name: 'Pertamina Enduro Matic 10W-30', soldQty: 78, revenue: 4290000 },
      { partNumber: 'FLT-AVZ-001', name: 'Filter Oli Avanza/Xenia', soldQty: 48, revenue: 2304000 },
      { partNumber: 'PAD-VAR-CBS', name: 'Kampas Rem Depan Vario 160', soldQty: 32, revenue: 2080000 },
      { partNumber: 'BAT-GS-NS40Z', name: 'Aki GS Astra MF NS40Z', soldQty: 14, revenue: 11900000 },
    ];
  }

  async getVehicleAndPaymentRatio() {
    return {
      vehicleComposition: [
        { name: 'Mobil', count: 65, percentage: 65, color: '#F97316' },
        { name: 'Motor', count: 35, percentage: 35, color: '#FACC15' },
      ],
      paymentMethods: [
        { name: 'QRIS Dinamis', percentage: 45, color: '#10B981' },
        { name: 'Transfer Bank', percentage: 30, color: '#3B82F6' },
        { name: 'Tunai (Cash)', percentage: 25, color: '#F97316' },
      ],
    };
  }
}
