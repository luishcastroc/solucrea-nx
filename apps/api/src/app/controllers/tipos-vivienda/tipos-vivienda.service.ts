import { Injectable } from '@nestjs/common';
import { Prisma, TipoDeVivieda } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TiposViviendaService {
  constructor(private prisma: PrismaService) {}

  // Tipos de Vivienda

  async tipoDeVivienda(
    where: Prisma.TipoDeViviedaWhereUniqueInput,
  ): Promise<TipoDeVivieda | null> {
    return await this.prisma.tipoDeVivieda.findUnique({
      where,
    });
  }

  async tiposDeVivienda(): Promise<TipoDeVivieda[]> {
    return await this.prisma.tipoDeVivieda.findMany();
  }

  async createTipoDeVivienda(
    data: Prisma.TipoDeViviedaCreateInput,
  ): Promise<TipoDeVivieda> {
    return await this.prisma.tipoDeVivieda.create({
      data,
    });
  }

  async updateTipoDeVivienda(params: {
    where: Prisma.TipoDeViviedaWhereUniqueInput;
    data: Prisma.TipoDeViviedaUpdateInput;
  }): Promise<TipoDeVivieda> {
    const { where, data } = params;
    return await this.prisma.tipoDeVivieda.update({
      data,
      where,
    });
  }

  async deleteTipoDeVivienda(
    where: Prisma.TipoDeViviedaWhereUniqueInput,
  ): Promise<TipoDeVivieda> {
    return this.prisma.tipoDeVivieda.delete({
      where,
    });
  }
}
