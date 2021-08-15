import { UpdateUsuarioDto } from './../../dtos/update-usuario.dto';
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
import { Prisma, Role, Usuario as UsersModel } from '@prisma/client';

import { AuthService } from '../../auth/auth.service';
import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { LocalAuthGuard } from '../../guards/local.auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateUsuarioDto } from '../../dtos/create-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService, private readonly authService: AuthService) {}

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
    @Roles(Role.ADMIN, Role.CAJERO, Role.SECRE, Role.USUARIO)
    @Get('usuario/:id')
    async getUsuario(@Param('id') id: string): Promise<UsersModel> {
        return this.usuariosService.usuario({ id });
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('usuario')
    async createUsuario(@Body() data: CreateUsuarioDto): Promise<UsersModel> {
        const usuarioCreate = await this.usuariosService.createUsuario(data);
        delete usuarioCreate.password;
        return usuarioCreate;
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.CAJERO, Role.SECRE, Role.USUARIO)
    @Put('usuario/:id')
    async editUsuario(@Param('id') id: string, @Body() data: UpdateUsuarioDto, @Request() req): Promise<UsersModel> {
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
    async deleteUsuario(@Param('id') id: string): Promise<UsersModel> {
        const usuarioDelete = await this.usuariosService.deleteUsuario({ id });
        delete usuarioDelete.password;
        return usuarioDelete;
    }
}
