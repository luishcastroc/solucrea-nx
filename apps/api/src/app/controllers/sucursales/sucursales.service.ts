import { Injectable } from '@nestjs/common';
import { Prisma, Sucursal } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SucursalesService {
    constructor(private prisma: PrismaService) {}

    async sucursal(sucursalWhereUniqueInput: Prisma.SucursalWhereUniqueInput): Promise<Sucursal | null> {
        return this.prisma.sucursal.findUnique({
            where: sucursalWhereUniqueInput,
        });
    }

    async sucursales(): Promise<Sucursal[]> {
        return this.prisma.sucursal.findMany();
    }

    async createSucursal(data: Prisma.SucursalCreateInput): Promise<Sucursal> {
        return this.prisma.sucursal.create({
            data,
        });
    }

    async updateSucursal(params: {
        where: Prisma.SucursalWhereUniqueInput;
        data: Prisma.SucursalUpdateInput;
    }): Promise<Sucursal> {
        const { where, data } = params;
        return this.prisma.sucursal.update({
            data,
            where,
        });
    }

    async deleteSucursal(where: Prisma.SucursalWhereUniqueInput): Promise<Sucursal> {
        return this.prisma.sucursal.delete({
            where,
        });
    }
}
