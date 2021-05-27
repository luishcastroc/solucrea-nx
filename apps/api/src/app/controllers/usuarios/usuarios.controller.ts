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
} from '@nestjs/common';
import { Role, Usuario as UsersModel } from '@prisma/client';

import { UsuariosService } from './usuarios.service';
import { Public } from '../../decorators/public.decorator';
import { LocalAuthGuard } from '../../guards/local.auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthService } from '../../auth/auth.service';

@Controller()
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly authService: AuthService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('usuarios')
    async getUsuarios(): Promise<UsersModel[]> {
        return this.usuariosService.usuarios();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('usuario/:id')
    async getUsuario(@Param('id') id: number): Promise<UsersModel> {
        return this.usuariosService.usuario({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('usuario')
    async createUsuario(@Body() userData: UsersModel): Promise<UsersModel> {
        const {
            nombreUsuario,
            password,
            nombre,
            apellido,
            role,
            sucursalId,
        } = userData;
        return this.usuariosService.createUsuario({
            nombreUsuario,
            password,
            nombre,
            apellido,
            role,
            sucursal: { connect: { id: sucursalId } },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('usuario/:id')
    async editUsuario(
        @Param('id') id: string,
        @Body() userData: UsersModel
    ): Promise<UsersModel> {
        const {
            nombreUsuario,
            password,
            nombre,
            apellido,
            role,
            sucursalId,
        } = userData;
        return this.usuariosService.updateUsuario({
            where: { id: Number(id) },
            data: {
                nombreUsuario,
                password,
                nombre,
                apellido,
                role,
                sucursal: { connect: { id: sucursalId } },
            },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('usuario/:id')
    async deleteUsuario(@Param('id') id: string): Promise<UsersModel> {
        return this.usuariosService.deleteUsuario({ id: Number(id) });
    }
}
