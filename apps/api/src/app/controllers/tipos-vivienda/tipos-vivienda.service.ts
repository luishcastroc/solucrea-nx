import { Injectable } from '@nestjs/common';
import { Prisma, TipoDeVivienda } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TiposViviendaService {
    constructor(private prisma: PrismaService) {}

    // Tipos de Vivienda

    async tipoDeVivienda(
        where: Prisma.TipoDeViviendaWhereUniqueInput
    ): Promise<TipoDeVivienda | null> {
        return await this.prisma.tipoDeVivienda.findUnique({
            where,
        });
    }

    async tiposDeVivienda(): Promise<TipoDeVivienda[]> {
        return await this.prisma.tipoDeVivienda.findMany();
    }

    async createTipoDeVivienda(
        data: Prisma.TipoDeViviendaCreateInput
    ): Promise<TipoDeVivienda> {
        return await this.prisma.tipoDeVivienda.create({
            data,
        });
    }

    async updateTipoDeVivienda(params: {
        where: Prisma.TipoDeViviendaWhereUniqueInput;
        data: Prisma.TipoDeViviendaUpdateInput;
    }): Promise<TipoDeVivienda> {
        const { where, data } = params;
        return await this.prisma.tipoDeVivienda.update({
            data,
            where,
        });
    }

    async deleteTipoDeVivienda(
        where: Prisma.TipoDeViviendaWhereUniqueInput
    ): Promise<TipoDeVivienda> {
        return this.prisma.tipoDeVivienda.delete({
            where,
        });
    }
}
