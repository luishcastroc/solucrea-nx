import { Ciudad, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'api/prisma';

@Injectable()
export class CiudadService {
    constructor(private prisma: PrismaService) {}

    async ciudad(ciudadWhereUniqueInput: Prisma.CiudadWhereUniqueInput): Promise<Ciudad | null> {
        return this.prisma.ciudad.findUnique({
            where: ciudadWhereUniqueInput,
        });
    }

    async ciudades(): Promise<Ciudad[]> {
        return this.prisma.ciudad.findMany();
    }

    async createCiudad(data: Prisma.CiudadCreateInput): Promise<Ciudad> {
        return this.prisma.ciudad.create({
            data,
        });
    }

    async updateCiudad(params: {
        where: Prisma.CiudadWhereUniqueInput;
        data: Prisma.CiudadUpdateInput;
    }): Promise<Ciudad> {
        const { where, data } = params;
        return this.prisma.ciudad.update({
            data,
            where,
        });
    }

    async deleteCiudad(where: Prisma.CiudadWhereUniqueInput): Promise<Ciudad> {
        return this.prisma.ciudad.delete({
            where,
        });
    }
}
