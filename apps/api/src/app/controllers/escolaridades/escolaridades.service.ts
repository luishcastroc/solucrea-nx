import { Injectable } from '@nestjs/common';
import { Escolaridad, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EscolaridadesService {
  constructor(private prisma: PrismaService) {}

  // Escolaridad

  async escolaridad(
    where: Prisma.EscolaridadWhereUniqueInput,
  ): Promise<Escolaridad | null> {
    return await this.prisma.escolaridad.findUnique({
      where,
    });
  }

  async escolaridades(): Promise<Escolaridad[]> {
    return await this.prisma.escolaridad.findMany();
  }

  async createEscolaridad(
    data: Prisma.EscolaridadCreateInput,
  ): Promise<Escolaridad> {
    return await this.prisma.escolaridad.create({
      data,
    });
  }

  async updateEscolaridad(params: {
    where: Prisma.EscolaridadWhereUniqueInput;
    data: Prisma.EscolaridadUpdateInput;
  }): Promise<Escolaridad> {
    const { where, data } = params;
    return await this.prisma.escolaridad.update({
      data,
      where,
    });
  }

  async deleteEscolaridad(
    where: Prisma.EscolaridadWhereUniqueInput,
  ): Promise<Escolaridad> {
    return this.prisma.escolaridad.delete({
      where,
    });
  }
}
