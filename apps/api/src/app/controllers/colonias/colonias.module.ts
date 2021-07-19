import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ColoniasController } from './colonias.controller';
import { ColoniasService } from './colonias.service';

@Module({
    controllers: [ColoniasController],
    providers: [ColoniasService, PrismaService],
})
export class ColoniasModule {}
