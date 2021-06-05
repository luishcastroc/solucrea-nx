import { Prisma } from '@prisma/client';
import { Fraccionamiento } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FraccionamientosService {
    constructor(private prisma: PrismaService) {}

    async fraccionamiento(
        fraccionamientoWhereUniqueInput: Prisma.FraccionamientoWhereUniqueInput
    ): Promise<Fraccionamiento | null> {
        return this.prisma.fraccionamiento.findUnique({
            where: fraccionamientoWhereUniqueInput,
        });
    }

    async fraccionamientos(): Promise<Fraccionamiento[]> {
        return this.prisma.fraccionamiento.findMany();
    }

    async createFraccionamiento(
        data: Prisma.FraccionamientoCreateInput
    ): Promise<Fraccionamiento> {
        return this.prisma.fraccionamiento.create({
            data,
        });
    }

    async updateFraccionamiento(params: {
        where: Prisma.FraccionamientoWhereUniqueInput;
        data: Prisma.FraccionamientoUpdateInput;
    }): Promise<Fraccionamiento> {
        const { where, data } = params;
        return this.prisma.fraccionamiento.update({
            data,
            where,
        });
    }

    async deleteFraccionamiento(
        where: Prisma.FraccionamientoWhereUniqueInput
    ): Promise<Fraccionamiento> {
        return this.prisma.fraccionamiento.delete({
            where,
        });
    }
}
