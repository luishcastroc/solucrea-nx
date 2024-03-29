import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './sucursales.service';

@Module({
  controllers: [SucursalesController],
  providers: [SucursalesService, PrismaService],
  exports: [SucursalesService],
})
export class SucursalesModule {}
