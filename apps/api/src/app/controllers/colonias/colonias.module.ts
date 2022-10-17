import { Module } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

import { ColoniasController } from './colonias.controller';
import { ColoniasService } from './colonias.service';

@Module({
  controllers: [ColoniasController],
  providers: [ColoniasService, PrismaService],
})
export class ColoniasModule {}
