import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';
import { CreditosService } from '../creditos';

import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';

@Module({
  controllers: [PagosController],
  providers: [PagosService, PrismaService, CreditosService],
})
export class PagosModule {}
