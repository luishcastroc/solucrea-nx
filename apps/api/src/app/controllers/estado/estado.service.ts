import { Estado, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstadoService {
    constructor(private prisma: PrismaService) {}

    async estado(
        estadoWhereUniqueInput: Prisma.EstadoWhereUniqueInput
    ): Promise<Estado | null> {
        return this.prisma.estado.findUnique({
            where: estadoWhereUniqueInput,
        });
    }

    async estados(): Promise<Estado[]> {
        return this.prisma.estado.findMany();
    }

    async createEstado(data: Prisma.EstadoCreateInput): Promise<Estado> {
        return this.prisma.estado.create({
            data,
        });
    }

    async updateEstado(params: {
        where: Prisma.EstadoWhereUniqueInput;
        data: Prisma.EstadoUpdateInput;
    }): Promise<Estado> {
        const { where, data } = params;
        return this.prisma.estado.update({
            data,
            where,
        });
    }

    async deleteEstado(where: Prisma.EstadoWhereUniqueInput): Promise<Estado> {
        return this.prisma.estado.delete({
            where,
        });
    }
}
