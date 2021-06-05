import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AvalesController } from './avales.controller';
import { AvalesService } from './avales.service';

@Module({
    controllers: [AvalesController],
    providers: [AvalesService, PrismaService],
})
export class AvalesModule {}
