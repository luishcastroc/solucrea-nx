import { IEstadoCivilReturnDto } from './../../dtos/estado-civil-return.dto';
import { Injectable } from '@nestjs/common';
import { EstadoCivil, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstadosCivilesService {
    constructor(private prisma: PrismaService) {}

    // Estado Civil

    async estadoCivil(
        where: Prisma.EstadoCivilWhereUniqueInput
    ): Promise<IEstadoCivilReturnDto | null> {
        return await this.prisma.estadoCivil.findUnique({
            where,
            select: { id: true, descripcion: true },
        });
    }

    async estadosCiviles(): Promise<IEstadoCivilReturnDto[]> {
        return await this.prisma.estadoCivil.findMany({
            select: { id: true, descripcion: true },
        });
    }

    async createEstadoCivil(
        data: Prisma.EstadoCivilCreateInput
    ): Promise<IEstadoCivilReturnDto> {
        return await this.prisma.estadoCivil.create({
            data,
            select: { id: true, descripcion: true },
        });
    }

    async updateEstadoCivil(params: {
        where: Prisma.EstadoCivilWhereUniqueInput;
        data: Prisma.EstadoCivilUpdateInput;
    }): Promise<IEstadoCivilReturnDto> {
        const { where, data } = params;
        return await this.prisma.estadoCivil.update({
            data,
            where,
            select: { id: true, descripcion: true },
        });
    }

    async deleteEstadoCivil(
        where: Prisma.EstadoCivilWhereUniqueInput
    ): Promise<IEstadoCivilReturnDto> {
        return this.prisma.estadoCivil.delete({
            where,
            select: { id: true, descripcion: true },
        });
    }
}
