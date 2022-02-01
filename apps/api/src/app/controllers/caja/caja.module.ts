import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { PrismaService } from 'api/prisma';
import { UtilService } from 'api/util';

@Module({
    controllers: [CajaController],
    providers: [UtilService, CajaService, PrismaService],
})
export class CajaModule {}
