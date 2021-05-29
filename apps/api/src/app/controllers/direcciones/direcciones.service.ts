import { Injectable } from '@nestjs/common';
import { Direccion, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DireccionesService {
    constructor(private prisma: PrismaService) {}

    async direccion(
        where: Prisma.DireccionWhereUniqueInput
    ): Promise<Direccion | null> {
        return await this.prisma.direccion.findUnique({
            where,
        });
    }

    async direcciones(): Promise<Direccion[]> {
        return await this.prisma.direccion.findMany();
    }

    async createDireccion(
        data: Prisma.DireccionCreateInput
    ): Promise<Direccion> {
        return await this.prisma.direccion.create({
            data,
        });
    }

    async updateDireccion(params: {
        where: Prisma.DireccionWhereUniqueInput;
        data: Prisma.DireccionUpdateInput;
    }): Promise<Direccion> {
        const { where, data } = params;
        return await this.prisma.direccion.update({
            data,
            where,
        });
    }

    async deleteDireccion(
        where: Prisma.DireccionWhereUniqueInput
    ): Promise<Direccion> {
        return this.prisma.direccion.delete({
            where,
        });
    }
}
