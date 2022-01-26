import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { DireccionesController } from './direcciones.controller';
import { DireccionesService } from './direcciones.service';

@Module({
    controllers: [DireccionesController],
    providers: [DireccionesService, PrismaService],
})
export class DireccionesModule {}
