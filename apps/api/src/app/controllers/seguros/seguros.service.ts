import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IModalidadSeguroReturnDto, ISeguroReturnDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';

@Injectable()
export class SegurosService {
    constructor(private prisma: PrismaService) {}

    // Seguro

    async seguro(where: Prisma.SeguroWhereUniqueInput): Promise<ISeguroReturnDto | null> {
        return await this.prisma.seguro.findUnique({
            where,
            select: { id: true, nombre: true, monto: true },
        });
    }

    async seguros(): Promise<ISeguroReturnDto[]> {
        return await this.prisma.seguro.findMany({
            select: { id: true, nombre: true, monto: true },
        });
    }

    async createSeguro(data: Prisma.SeguroCreateInput): Promise<ISeguroReturnDto> {
        return await this.prisma.seguro.create({
            data,
            select: { id: true, nombre: true, monto: true },
        });
    }

    async updateSeguro(params: {
        where: Prisma.SeguroWhereUniqueInput;
        data: Prisma.SeguroUpdateInput;
    }): Promise<ISeguroReturnDto> {
        const { where, data } = params;
        return await this.prisma.seguro.update({
            data,
            where,
            select: { id: true, nombre: true, monto: true },
        });
    }

    async deleteSeguro(where: Prisma.SeguroWhereUniqueInput): Promise<ISeguroReturnDto> {
        return await this.prisma.seguro.delete({
            where,
            select: { id: true, nombre: true, monto: true },
        });
    }

    // Modalidades

    async modalidades(): Promise<IModalidadSeguroReturnDto[]> {
        const modalidadesDeSeguro = await this.prisma.modalidadDeSeguro.findMany({
            select: { id: true, titulo: true, descripcion: true },
        });
        return modalidadesDeSeguro;
    }
}
