import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { FraccionamientosController } from './fraccionamientos.controller';
import { FraccionamientosService } from './fraccionamientos.service';

@Module({
    controllers: [FraccionamientosController],
    providers: [FraccionamientosService, PrismaService],
})
export class FraccionamientosModule {}
