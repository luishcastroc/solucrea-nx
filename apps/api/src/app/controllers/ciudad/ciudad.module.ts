import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { CiudadController } from './ciudad.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    providers: [CiudadService],
    controllers: [CiudadController, PrismaService],
})
export class CiudadModule {}
