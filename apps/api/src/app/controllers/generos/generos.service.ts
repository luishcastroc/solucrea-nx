import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { IGeneroReturnDto } from '../../dtos/genero-return.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GenerosService {
    constructor(private prisma: PrismaService) {}

    // Genero

    async genero(where: Prisma.GeneroWhereUniqueInput): Promise<IGeneroReturnDto | null> {
        return await this.prisma.genero.findUnique({
            where,
            select: { id: true, descripcion: true },
        });
    }

    async generos(): Promise<IGeneroReturnDto[]> {
        return await this.prisma.genero.findMany({
            select: { id: true, descripcion: true },
        });
    }

    async createGenero(data: Prisma.GeneroCreateInput): Promise<IGeneroReturnDto> {
        return await this.prisma.genero.create({
            data,
            select: { id: true, descripcion: true },
        });
    }

    async updateGenero(params: {
        where: Prisma.GeneroWhereUniqueInput;
        data: Prisma.GeneroUpdateInput;
    }): Promise<IGeneroReturnDto> {
        const { where, data } = params;
        return await this.prisma.genero.update({
            data,
            where,
            select: { id: true, descripcion: true },
        });
    }

    async deleteGenero(where: Prisma.GeneroWhereUniqueInput): Promise<IGeneroReturnDto> {
        return this.prisma.genero.delete({
            where,
            select: { id: true, descripcion: true },
        });
    }
}
