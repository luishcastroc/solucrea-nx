import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { EscolaridadesController } from './escolaridades.controller';
import { EscolaridadesService } from './escolaridades.service';

@Module({
    controllers: [EscolaridadesController],
    providers: [EscolaridadesService, PrismaService],
})
export class EscolaridadesModule {}
