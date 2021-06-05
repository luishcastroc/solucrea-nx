import { Prisma } from '@prisma/client';
import { Caja } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CajaService {
    constructor(private prisma: PrismaService) {}

    async caja(
        cajaWhereUniqueInput: Prisma.CajaWhereUniqueInput
    ): Promise<Caja | null> {
        return this.prisma.caja.findUnique({
            where: cajaWhereUniqueInput,
        });
    }

    async cajas(): Promise<Caja[]> {
        return this.prisma.caja.findMany();
    }

    async createCaja(data: Prisma.CajaCreateInput): Promise<Caja> {
        return this.prisma.caja.create({
            data,
        });
    }

    async updateCaja(params: {
        where: Prisma.CajaWhereUniqueInput;
        data: Prisma.CajaUpdateInput;
    }): Promise<Caja> {
        const { where, data } = params;
        return this.prisma.caja.update({
            data,
            where,
        });
    }

    async deleteCaja(where: Prisma.CajaWhereUniqueInput): Promise<Caja> {
        return this.prisma.caja.delete({
            where,
        });
    }
}
