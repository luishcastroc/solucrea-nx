import { Injectable } from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async usuario(
    where: Prisma.UsuarioWhereUniqueInput,
  ): Promise<Usuario | null> {
    const usuarioReturn = await this.prisma.usuario.findUnique({
      where,
      include: { sucursal: true },
    });
    delete usuarioReturn.password;
    delete usuarioReturn.sucursalId;

    return usuarioReturn;
  }

  async usuarios(): Promise<Usuario[]> {
    const users = await this.prisma.usuario.findMany({
      include: { sucursal: true },
    });
    const usuarioReturn = users.map((usuario) => {
      delete usuario.password;
      delete usuario.sucursalId;
      return usuario;
    });
    return usuarioReturn;
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
    data: Prisma.UsuarioUpdateInput;
  }): Promise<Usuario> {
    const { where, data } = params;
    const usuarioActualizado = await this.prisma.usuario.update({
      data,
      where,
    });
    delete usuarioActualizado.password;
    return usuarioActualizado;
  }

  async deleteUsuario(where: Prisma.UsuarioWhereUniqueInput): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where,
    });
  }

  async searchUsuarioByName(
    where: Prisma.UsuarioWhereUniqueInput,
  ): Promise<Usuario> {
    return this.prisma.usuario.findFirst({
      where,
      include: { sucursal: true },
    });
  }
}
