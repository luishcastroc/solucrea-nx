import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'api/prisma';

import { IColoniaReturnDto } from 'api/dtos';
import { Colonia } from '.prisma/client';

@Injectable()
export class ColoniasService {
    constructor(private prisma: PrismaService) {}

    async colonia(coloniaWhereUniqueInput: Prisma.ColoniaWhereUniqueInput): Promise<Colonia | null> {
        return this.prisma.colonia.findUnique({
            where: coloniaWhereUniqueInput,
        });
    }

    async colonias(): Promise<Colonia[]> {
        return this.prisma.colonia.findMany();
    }

    async coloniasByCp(where: Prisma.ColoniaWhereInput): Promise<IColoniaReturnDto> {
        const singleColonia = await this.prisma.colonia.findFirst({
            where,
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

        if (!singleColonia) {
            throw new HttpException('El Codigo Postal no existe, verificar', HttpStatus.NOT_FOUND);
        }

        const ciudad = {
            id: singleColonia.ciudad?.id,
            descripcion: singleColonia.ciudad?.descripcion,
        };
        const estado = {
            id: singleColonia.ciudad?.estado.id,
            descripcion: singleColonia.ciudad?.estado.descripcion,
        };

        const colonias = await this.prisma.colonia.findMany({
            where,
            select: {
                id: true,
                descripcion: true,
                codigoPostal: true,
            },
        });

        const coloniasReturn = { ciudad, estado, colonias };

        return coloniasReturn as IColoniaReturnDto;
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

    async deleteColonia(where: Prisma.ColoniaWhereUniqueInput): Promise<Colonia> {
        return this.prisma.colonia.delete({
            where,
        });
    }
}
