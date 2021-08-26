import { Injectable } from '@nestjs/common';
import { ActividadEconomica, Prisma } from '@prisma/client';

import { IActividadEconomicaReturnDto } from '../../dtos/actividad-economica-return.dto';
import { CreateActividadEconomicaDto } from '../../dtos/create-actividad-economica.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActividadesEconomicasService {
    constructor(private prisma: PrismaService) {}

    async actividadEconomica(
        avalWhereUniqueInput: Prisma.ActividadEconomicaWhereUniqueInput
    ): Promise<IActividadEconomicaReturnDto | null> {
        return this.prisma.actividadEconomica.findUnique({
            where: avalWhereUniqueInput,
            select: { id: true, descripcion: true, montoMin: true, montoMax: true },
        });
    }

    async actividadesEconomicas(): Promise<IActividadEconomicaReturnDto[]> {
        return this.prisma.actividadEconomica.findMany({
            select: { id: true, descripcion: true, montoMin: true, montoMax: true },
        });
    }

    async createActividadEconomica(data: CreateActividadEconomicaDto): Promise<IActividadEconomicaReturnDto> {
        return this.prisma.actividadEconomica.create({
            data,
        });
    }

    async updateActividadEconomica(params: {
        where: Prisma.ActividadEconomicaWhereUniqueInput;
        data: Prisma.ActividadEconomicaUpdateInput;
    }): Promise<IActividadEconomicaReturnDto> {
        const { where, data } = params;
        return this.prisma.actividadEconomica.update({
            data,
            where,
        });
    }

    async deleteActividadEconomica(
        where: Prisma.ActividadEconomicaWhereUniqueInput
    ): Promise<IActividadEconomicaReturnDto> {
        return this.prisma.actividadEconomica.delete({
            where,
        });
    }
}
