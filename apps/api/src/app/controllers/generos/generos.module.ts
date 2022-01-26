import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { GenerosController } from './generos.controller';
import { GenerosService } from './generos.service';

@Module({
    controllers: [GenerosController],
    providers: [GenerosService, PrismaService],
})
export class GenerosModule {}
