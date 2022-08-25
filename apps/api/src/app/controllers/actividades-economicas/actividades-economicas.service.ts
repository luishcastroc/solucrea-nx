import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateActividadEconomicaDto, IActividadEconomicaReturnDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';

@Injectable()
export class ActividadesEconomicasService {
    constructor(private prisma: PrismaService) {}

    async actividadEconomica(
        where: Prisma.ActividadEconomicaWhereUniqueInput
    ): Promise<IActividadEconomicaReturnDto | null> {
        return this.prisma.actividadEconomica.findUnique({
            where,
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
