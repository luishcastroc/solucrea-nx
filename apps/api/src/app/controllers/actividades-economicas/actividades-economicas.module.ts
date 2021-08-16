import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ActividadesEconomicasController } from './actividades-economicas.controller';
import { ActividadesEconomicasService } from './actividades-economicas.service';

@Module({
    controllers: [ActividadesEconomicasController],
    providers: [ActividadesEconomicasService, PrismaService],
})
export class ActividadesEconomicasModule {}
