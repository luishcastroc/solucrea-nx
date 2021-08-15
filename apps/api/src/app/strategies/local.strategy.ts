import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth/auth.service';
import { IUsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<IUsuarioRespuestaDto> {
        const usuario = { nombreUsuario: username, password };
        const usuarioRetorno = await this.authService.validarUsuario(usuario);
        if (!usuarioRetorno) {
            throw new UnauthorizedException();
        }
        return usuarioRetorno;
    }
}
