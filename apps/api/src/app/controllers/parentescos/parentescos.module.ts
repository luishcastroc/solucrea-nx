import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { ParentescosController } from './parentescos.controller';
import { ParentescosService } from './parentescos.service';

@Module({
    controllers: [ParentescosController],
    providers: [ParentescosService, PrismaService],
})
export class ParentescosModule {}
