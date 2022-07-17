import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';

@Module({
    controllers: [PagosController],
    providers: [PagosService, PrismaService],
})
export class PagosModule {}
