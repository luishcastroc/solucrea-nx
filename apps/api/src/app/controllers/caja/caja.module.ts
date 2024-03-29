import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { PrismaService } from 'api/prisma';

@Module({
  controllers: [CajaController],
  providers: [CajaService, PrismaService],
})
export class CajaModule {}
