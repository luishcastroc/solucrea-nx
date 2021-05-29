import { Module } from '@nestjs/common';

import { PrismaService } from './../../prisma/prisma.service';
import { EstadosCivilesController } from './estados-civiles.controller';
import { EstadosCivilesService } from './estados-civiles.service';

@Module({
    controllers: [EstadosCivilesController],
    providers: [EstadosCivilesService, PrismaService],
})
export class EstadosCivilesModule {}
