import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { EstadoController } from './estado.controller';
import { EstadoService } from './estado.service';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService, PrismaService],
})
export class EstadoModule {}
