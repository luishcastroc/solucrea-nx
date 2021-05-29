import { Module } from '@nestjs/common';

import { PrismaService } from './../../prisma/prisma.service';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';

@Module({
    controllers: [ClientesController],
    providers: [ClientesService, PrismaService],
})
export class ClientesModule {}
