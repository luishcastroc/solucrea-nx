import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { EstadosCivilesController } from './estados-civiles.controller';
import { EstadosCivilesService } from './estados-civiles.service';

@Module({
  controllers: [EstadosCivilesController],
  providers: [EstadosCivilesService, PrismaService],
})
export class EstadosCivilesModule {}
