import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    providers: [CajaService],
    controllers: [CajaController, PrismaService],
})
export class CajaModule {}
