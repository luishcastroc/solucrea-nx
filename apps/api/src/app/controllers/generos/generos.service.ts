import { Injectable } from '@nestjs/common';
import { Genero, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GenerosService {
    constructor(private prisma: PrismaService) {}

    // Genero

    async genero(where: Prisma.GeneroWhereUniqueInput): Promise<Genero | null> {
        return await this.prisma.genero.findUnique({
            where,
        });
    }

    async generos(): Promise<Genero[]> {
        return await this.prisma.genero.findMany();
    }

    async createGenero(data: Prisma.GeneroCreateInput): Promise<Genero> {
        return await this.prisma.genero.create({
            data,
        });
    }

    async updateGenero(params: {
        where: Prisma.GeneroWhereUniqueInput;
        data: Prisma.GeneroUpdateInput;
    }): Promise<Genero> {
        const { where, data } = params;
        return await this.prisma.genero.update({
            data,
            where,
        });
    }

    async deleteGenero(where: Prisma.GeneroWhereUniqueInput): Promise<Genero> {
        return this.prisma.genero.delete({
            where,
        });
    }
}
