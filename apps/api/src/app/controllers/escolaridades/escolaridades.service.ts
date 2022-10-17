import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEscolaridadReturnDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';

@Injectable()
export class EscolaridadesService {
  constructor(private prisma: PrismaService) {}

  // Escolaridad

  async escolaridad(
    where: Prisma.EscolaridadWhereUniqueInput
  ): Promise<IEscolaridadReturnDto | null> {
    return await this.prisma.escolaridad.findUnique({
      where,
      select: { id: true, descripcion: true },
    });
  }

  async escolaridades(): Promise<IEscolaridadReturnDto[]> {
    return await this.prisma.escolaridad.findMany({
      select: { id: true, descripcion: true },
    });
  }

  async createEscolaridad(
    data: Prisma.EscolaridadCreateInput
  ): Promise<IEscolaridadReturnDto> {
    return await this.prisma.escolaridad.create({
      data,
      select: { id: true, descripcion: true },
    });
  }

  async updateEscolaridad(params: {
    where: Prisma.EscolaridadWhereUniqueInput;
    data: Prisma.EscolaridadUpdateInput;
  }): Promise<IEscolaridadReturnDto> {
    const { where, data } = params;
    return await this.prisma.escolaridad.update({
      data,
      where,
      select: { id: true, descripcion: true },
    });
  }

  async deleteEscolaridad(
    where: Prisma.EscolaridadWhereUniqueInput
  ): Promise<IEscolaridadReturnDto> {
    return this.prisma.escolaridad.delete({
      where,
      select: { id: true, descripcion: true },
    });
  }
}
