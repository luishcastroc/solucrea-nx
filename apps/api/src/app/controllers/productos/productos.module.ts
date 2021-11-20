import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

@Module({
    controllers: [ProductosController],
    providers: [ProductosService, PrismaService],
})
export class ProductosModule {}
