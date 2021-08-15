import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../controllers/usuarios/usuarios.service';
import { IUsuarioDto } from '../dtos/usuario-login.dto';
import { IUsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';

@Injectable()
export class AuthService {
    constructor(private usuariosService: UsuariosService, private jwtService: JwtService) {}

    async validarUsuario(usuarioDto: IUsuarioDto): Promise<IUsuarioRespuestaDto> {
        const user = await this.usuariosService.searchUsuarioByName({
            nombreUsuario: usuarioDto.nombreUsuario,
        });

        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(usuarioDto.password, user.password);

        if (isMatch) {
            delete user.password;
            return user;
        }
        return null;
    }

    async login(user: IUsuarioRespuestaDto) {
        const { nombreUsuario, id, sucursales, role } = user;
        const payload = {
            username: nombreUsuario,
            sub: id,
            role,
            sucursales,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user,
        };
    }
}
