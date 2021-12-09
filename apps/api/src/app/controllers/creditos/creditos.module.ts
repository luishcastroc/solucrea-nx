import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreditosController } from './creditos.controller';
import { CreditosService } from './creditos.service';

@Module({
    controllers: [CreditosController],
    providers: [CreditosService, PrismaService],
    exports: [CreditosService],
})
export class CreditosModule {}
