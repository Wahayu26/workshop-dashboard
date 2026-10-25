import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ServicesModule } from './modules/services/services.module';
import { SparePartsModule } from './modules/spare-parts/spare-parts.module';
import { MechanicsModule } from './modules/mechanics/mechanics.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { WorkOrdersModule } from './modules/work-orders/work-orders.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    ServicesModule,
    SparePartsModule,
    MechanicsModule,
    BookingsModule,
    WorkOrdersModule,
    InvoicesModule,
  ],
})
export class AppModule {}
