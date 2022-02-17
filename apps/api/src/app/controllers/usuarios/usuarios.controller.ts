import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Prisma, Role, Usuario } from '@prisma/client';
import { AuthService } from 'api/auth';
import { UsuariosService } from './usuarios.service';
import { Public, Roles } from 'api/decorators';
import { CreateUsuarioDto, UpdateUsuarioDto } from 'api/dtos';
import { LocalAuthGuard, RolesGuard } from 'api/guards';

@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService, private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('usuarios')
    async getUsuarios(): Promise<Partial<Usuario>[]> {
        return this.usuariosService.usuarios();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.CAJERO, Role.SECRETARIO, Role.USUARIO)
    @Get('usuario/:id')
    async getUsuario(@Param('id') id: string): Promise<Partial<Usuario | null>> {
        return this.usuariosService.usuario({ id });
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('usuario')
    async createUsuario(@Body() data: CreateUsuarioDto): Promise<Partial<Usuario>> {
        return await this.usuariosService.createUsuario(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.CAJERO, Role.SECRETARIO, Role.USUARIO)
    @Put('usuario/:id')
    async editUsuario(
        @Param('id') id: string,
        @Body() data: UpdateUsuarioDto,
        @Request() req: any
    ): Promise<Partial<Usuario>> {
        const role = req.user.role;
        data.actualizadoPor = req.user.username;
        return this.usuariosService.updateUsuario({
            where: { id },
            data,
            role,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('usuario/:id')
    async deleteUsuario(@Param('id') id: string): Promise<Partial<Usuario>> {
        const usuarioDelete = await this.usuariosService.deleteUsuario({ id });
        return usuarioDelete;
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.CAJERO, Role.SECRETARIO, Role.USUARIO)
    @Post('usuarios/where')
    async getUsuariosWhere(@Body() data: Prisma.UsuarioWhereInput): Promise<Partial<Usuario>[]> {
        return this.usuariosService.usuariosWhere(data);
    }
}
