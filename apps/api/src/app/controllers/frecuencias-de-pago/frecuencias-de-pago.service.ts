import { Injectable } from '@nestjs/common';
import { FrecuenciaDePago, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FrecuenciasDePagoService {
    constructor(private prisma: PrismaService) {}

    // Genero

    async frecuenciaDePago(where: Prisma.FrecuenciaDePagoWhereUniqueInput): Promise<Partial<FrecuenciaDePago> | null> {
        return await this.prisma.frecuenciaDePago.findUnique({
            where,
            select: { id: true, descripcion: true },
        });
    }

    async frecuenciasDePago(): Promise<Array<Partial<FrecuenciaDePago>>> {
        return await this.prisma.frecuenciaDePago.findMany({
            select: { id: true, descripcion: true },
        });
    }

    async createFrecuenciaDePago(data: Prisma.FrecuenciaDePagoCreateInput): Promise<Partial<FrecuenciaDePago>> {
        return await this.prisma.frecuenciaDePago.create({
            data,
            select: { id: true, descripcion: true },
        });
    }

    async updateFrecuenciaDePago(params: {
        where: Prisma.FrecuenciaDePagoWhereUniqueInput;
        data: Prisma.FrecuenciaDePagoUpdateInput;
    }): Promise<Partial<FrecuenciaDePago>> {
        const { where, data } = params;
        return await this.prisma.frecuenciaDePago.update({
            data,
            where,
            select: { id: true, descripcion: true },
        });
    }

    async deleteFrecuenciaDePago(where: Prisma.FrecuenciaDePagoWhereUniqueInput): Promise<Partial<FrecuenciaDePago>> {
        return this.prisma.frecuenciaDePago.delete({
            where,
            select: { id: true, descripcion: true },
        });
    }
}
