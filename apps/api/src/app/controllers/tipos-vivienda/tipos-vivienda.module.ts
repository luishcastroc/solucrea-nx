import { Module } from '@nestjs/common';

import { PrismaService } from './../../prisma/prisma.service';
import { TiposViviendaController } from './tipos-vivienda.controller';
import { TiposViviendaService } from './tipos-vivienda.service';

@Module({
    controllers: [TiposViviendaController],
    providers: [TiposViviendaService, PrismaService],
})
export class TiposViviendaModule {}
