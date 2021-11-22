import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { FrecuenciaDePagoController } from './frecuencias-de-pago.controller';
import { FrecuenciasDePagoService } from './frecuencias-de-pago.service';

@Module({
    controllers: [FrecuenciaDePagoController],
    providers: [FrecuenciasDePagoService, PrismaService],
})
export class GenerosModule {}
