import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ITipoDeViviendaReturnDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';

@Injectable()
export class TiposViviendaService {
  constructor(private prisma: PrismaService) {}

  // Tipos de Vivienda

  async tipoDeVivienda(
    where: Prisma.TipoDeViviendaWhereUniqueInput
  ): Promise<ITipoDeViviendaReturnDto | null> {
    return await this.prisma.tipoDeVivienda.findUnique({
      where,
      select: { id: true, descripcion: true },
    });
  }

  async tiposDeVivienda(): Promise<ITipoDeViviendaReturnDto[]> {
    return await this.prisma.tipoDeVivienda.findMany({
      select: { id: true, descripcion: true },
    });
  }

  async createTipoDeVivienda(
    data: Prisma.TipoDeViviendaCreateInput
  ): Promise<ITipoDeViviendaReturnDto> {
    return await this.prisma.tipoDeVivienda.create({
      data,
      select: { id: true, descripcion: true },
    });
  }

  async updateTipoDeVivienda(params: {
    where: Prisma.TipoDeViviendaWhereUniqueInput;
    data: Prisma.TipoDeViviendaUpdateInput;
  }): Promise<ITipoDeViviendaReturnDto> {
    const { where, data } = params;
    return await this.prisma.tipoDeVivienda.update({
      data,
      where,
      select: { id: true, descripcion: true },
    });
  }

  async deleteTipoDeVivienda(
    where: Prisma.TipoDeViviendaWhereUniqueInput
  ): Promise<ITipoDeViviendaReturnDto> {
    return this.prisma.tipoDeVivienda.delete({
      where,
      select: { id: true, descripcion: true },
    });
  }
}
