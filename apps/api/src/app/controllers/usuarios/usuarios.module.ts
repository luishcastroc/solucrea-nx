import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'api/auth';
import { PrismaService } from 'api/prisma';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UsuariosController],
    providers: [UsuariosService, PrismaService],
    exports: [UsuariosService],
})
export class UsuariosModule {}
