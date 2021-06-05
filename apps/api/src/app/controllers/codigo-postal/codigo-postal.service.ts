import { CodigoPostal, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CodigoPostalService {
    constructor(private prisma: PrismaService) {}

    async codigoPostal(
        codigoPostalWhereUniqueInput: Prisma.CodigoPostalWhereUniqueInput
    ): Promise<CodigoPostal | null> {
        return this.prisma.codigoPostal.findUnique({
            where: codigoPostalWhereUniqueInput,
        });
    }

    async codigosPostales(): Promise<CodigoPostal[]> {
        return this.prisma.codigoPostal.findMany();
    }

    async createCodigoPostal(
        data: Prisma.CodigoPostalCreateInput
    ): Promise<CodigoPostal> {
        return this.prisma.codigoPostal.create({
            data,
        });
    }

    async updateCodigoPostal(params: {
        where: Prisma.CodigoPostalWhereUniqueInput;
        data: Prisma.CodigoPostalUpdateInput;
    }): Promise<CodigoPostal> {
        const { where, data } = params;
        return this.prisma.codigoPostal.update({
            data,
            where,
        });
    }

    async deleteCodigoPostal(
        where: Prisma.CodigoPostalWhereUniqueInput
    ): Promise<CodigoPostal> {
        return this.prisma.codigoPostal.delete({
            where,
        });
    }
}
