import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';
import { UtilService } from 'api/util';

import { CreditosController } from './creditos.controller';
import { CreditosService } from './creditos.service';

@Module({
    controllers: [CreditosController],
    providers: [UtilService, CreditosService, PrismaService],
    exports: [CreditosService],
})
export class CreditosModule {}
