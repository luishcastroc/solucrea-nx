import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { MovimientosController } from '.';
import { MovimientosService } from './movimientos.service';

@Module({
  imports: [],
  controllers: [MovimientosController],
  providers: [PrismaService, MovimientosService],
})
export class MovimientosModule {}
