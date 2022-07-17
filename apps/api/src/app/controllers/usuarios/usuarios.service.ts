import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role, Usuario } from '@prisma/client';
import { UpdateUsuarioDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) {}

    async usuario(where: Prisma.UsuarioWhereUniqueInput): Promise<Partial<Usuario> | null> {
        try {
            const usuarioReturn = await this.prisma.usuario.findUnique({
                where,
            });

            if (!usuarioReturn) {
                throw new HttpException({ message: 'El usuario no existe, verificar' }, HttpStatus.NOT_FOUND);
            }
            const { password, ...rest } = usuarioReturn;
            return rest;
        } catch (e: any) {
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al consultar usuario' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async usuarios(): Promise<Partial<Usuario>[]> {
        try {
            const users = await this.prisma.usuario.findMany();
            if (users.length === 0) {
                throw new HttpException({ message: 'No existen usuarios' }, HttpStatus.NOT_FOUND);
            }
            const usuarioReturn = users.map((usuario) => {
                const { password, ...rest } = usuario;
                return rest;
            });
            return usuarioReturn;
        } catch (e: any) {
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al consultar usuarios' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async usuariosWhere(where: Prisma.UsuarioWhereInput): Promise<Partial<Usuario>[]> {
        try {
            const users = await this.prisma.usuario.findMany({ where });
            if (users.length === 0) {
                return [];
            }
            const usuarioReturn = users.map((usuario) => {
                const { password, ...rest } = usuario;
                return rest;
            });
            return usuarioReturn;
        } catch (e: any) {
            if (e.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al consultar usuarios' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async createUsuario(data: Prisma.UsuarioCreateInput): Promise<Partial<Usuario>> {
        try {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(data.password, saltOrRounds);
            data = { ...data, password: hash };
            const usuarioCreado = await this.prisma.usuario.create({
                data,
            });
            const { password, ...rest } = usuarioCreado;
            return rest;
        } catch (e: any) {
            console.log(e);
            if (e.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al crear el usuario' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async updateUsuario(params: {
        where: Prisma.UsuarioWhereUniqueInput;
        data: UpdateUsuarioDto;
        role: Role;
    }): Promise<Partial<Usuario>> {
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
                const isMatch = await bcrypt.compare(data.oldPassword as string | Buffer, usuario.password);

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
            const { password, ...rest } = usuarioActualizado;
            return rest;
        } catch (e: any) {
            if (e.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al actualizar usuario' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async deleteUsuario(where: Prisma.UsuarioWhereUniqueInput): Promise<Partial<Usuario>> {
        try {
            const deleteUsuario = await this.prisma.usuario.delete({
                where,
            });

            const { password, ...rest } = deleteUsuario;
            return deleteUsuario;
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al borrar el Usuario.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async searchUsuarioByName(where: Prisma.UsuarioWhereUniqueInput): Promise<Partial<Usuario>> {
        const usuario = await this.prisma.usuario.findFirst({
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
