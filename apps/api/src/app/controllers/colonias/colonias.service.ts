import { IColoniaReturnDto } from './../../dtos/colonia-return.dto';
import { Prisma } from '@prisma/client';
import { Colonia } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ColoniasService {
    constructor(private prisma: PrismaService) {}

    async colonia(
        coloniaWhereUniqueInput: Prisma.ColoniaWhereUniqueInput
    ): Promise<Colonia | null> {
        return this.prisma.colonia.findUnique({
            where: coloniaWhereUniqueInput,
        });
    }

    async colonias(): Promise<Colonia[]> {
        return this.prisma.colonia.findMany();
    }

    async coloniasByCp(
        coloniaWhereInput: Prisma.ColoniaWhereInput
    ): Promise<IColoniaReturnDto[]> {
        return this.prisma.colonia.findMany({
            where: coloniaWhereInput,
            select: {
                id: true,
                descripcion: true,
                codigoPostal: true,
                ciudad: {
                    select: {
                        id: true,
                        descripcion: true,
                        estado: { select: { id: true, descripcion: true } },
                    },
                },
            },
        });
    }

    async createColonia(data: Prisma.ColoniaCreateInput): Promise<Colonia> {
        return this.prisma.colonia.create({
            data,
        });
    }

    async updateColonia(params: {
        where: Prisma.ColoniaWhereUniqueInput;
        data: Prisma.ColoniaUpdateInput;
    }): Promise<Colonia> {
        const { where, data } = params;
        return this.prisma.colonia.update({
            data,
            where,
        });
    }

    async deleteColonia(
        where: Prisma.ColoniaWhereUniqueInput
    ): Promise<Colonia> {
        return this.prisma.colonia.delete({
            where,
        });
    }
}
