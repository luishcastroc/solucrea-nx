import { Injectable } from '@nestjs/common';
import { EstadoCivil, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstadosCivilesService {
  constructor(private prisma: PrismaService) {}

  // Estado Civil

  async estadoCivil(
    where: Prisma.EstadoCivilWhereUniqueInput,
  ): Promise<EstadoCivil | null> {
    return await this.prisma.estadoCivil.findUnique({
      where,
    });
  }

  async estadosCiviles(): Promise<EstadoCivil[]> {
    return await this.prisma.estadoCivil.findMany();
  }

  async createEstadoCivil(
    data: Prisma.EstadoCivilCreateInput,
  ): Promise<EstadoCivil> {
    return await this.prisma.estadoCivil.create({
      data,
    });
  }

  async updateEstadoCivil(params: {
    where: Prisma.EstadoCivilWhereUniqueInput;
    data: Prisma.EstadoCivilUpdateInput;
  }): Promise<EstadoCivil> {
    const { where, data } = params;
    return await this.prisma.estadoCivil.update({
      data,
      where,
    });
  }

  async deleteEstadoCivil(
    where: Prisma.EstadoCivilWhereUniqueInput,
  ): Promise<EstadoCivil> {
    return this.prisma.estadoCivil.delete({
      where,
    });
  }
}
