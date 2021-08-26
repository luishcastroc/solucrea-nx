import { UpdateUsuarioDto } from './../../dtos/update-usuario.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Usuario, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) {}

    async usuario(where: Prisma.UsuarioWhereUniqueInput): Promise<Usuario | null> {
        try {
            const usuarioReturn = await this.prisma.usuario.findUnique({
                where,
            });

            if (!usuarioReturn) {
                throw new HttpException({ message: 'El usuario no existe, verificar' }, HttpStatus.NOT_FOUND);
            }
            delete usuarioReturn.password;
            return usuarioReturn;
        } catch {
            throw new HttpException({ message: 'Error al consultar usuario' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async usuarios(): Promise<Usuario[]> {
        try {
            const users = await this.prisma.usuario.findMany();
            if (users.length === 0) {
                throw new HttpException({ message: 'No existen usuarios' }, HttpStatus.NOT_FOUND);
            }
            const usuarioReturn = users.map((usuario) => {
                delete usuario.password;
                return usuario;
            });
            return usuarioReturn;
        } catch {
            throw new HttpException({ message: 'Error al consultar usuarios' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createUsuario(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(data.password, saltOrRounds);
        data = { ...data, password: hash };
        const usuarioCreado = await this.prisma.usuario.create({
            data,
        });
        delete usuarioCreado.password;
        return usuarioCreado;
    }

    async updateUsuario(params: {
        where: Prisma.UsuarioWhereUniqueInput;
        data: UpdateUsuarioDto;
        role: Role;
    }): Promise<Usuario> {
        const { where, role } = params;
        let { data } = params;
        if (data.password) {
            const usuario = await this.prisma.usuario.findUnique({ where });

            if (!usuario) {
                throw new HttpException({ message: 'El usuario no existe, verificar' }, HttpStatus.NOT_FOUND);
            }

            // if someone with ADMIN role is trying to change the password most likely is from the screen
            // so we let it pass
            if (role !== 'ADMIN') {
                const isMatch = await bcrypt.compare(data.oldPassword, usuario.password);

                if (!isMatch) {
                    throw new HttpException(
                        { message: 'El password es incorrecto, verificar' },
                        HttpStatus.BAD_REQUEST
                    );
                }
                delete data.oldPassword;
            }

            // encrypting the new password
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(data.password, saltOrRounds);
            data = { ...data, password: hash };
        }
        try {
            const usuarioActualizado = await this.prisma.usuario.update({
                data,
                where,
            });
            delete usuarioActualizado.password;
            return usuarioActualizado;
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al actualizar usuario.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteUsuario(where: Prisma.UsuarioWhereUniqueInput): Promise<Usuario> {
        try {
            return this.prisma.usuario.delete({
                where,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al borrar el Usuario.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async searchUsuarioByName(where: Prisma.UsuarioWhereUniqueInput): Promise<Usuario> {
        const usuario = this.prisma.usuario.findFirst({
            where,
        });
        if (!usuario) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, message: 'El usuario no existe, Verificar.' },
                HttpStatus.NOT_FOUND
            );
        }
        return usuario;
    }
}
