import { PrismaService } from '../../prisma/prisma.service';
import { EstadoController } from './estado.controller';
import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';

@Module({
    controllers: [EstadoController],
    providers: [EstadoService, PrismaService],
})
export class EstadoModule {}
