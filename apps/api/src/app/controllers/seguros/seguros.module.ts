import { Module } from '@nestjs/common';

import { PrismaService } from './../../prisma/prisma.service';
import { SegurosController } from './seguros.controller';
import { SegurosService } from './seguros.service';

@Module({
    controllers: [SegurosController],
    providers: [SegurosService, PrismaService],
})
export class SegurosModule {}
