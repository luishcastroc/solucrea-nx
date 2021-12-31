import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IParentescoReturnDto } from 'api/dtos';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ParentescosService {
    constructor(private prisma: PrismaService) {}

    // PArentesco

    async parentesco(where: Prisma.ParentescoWhereUniqueInput): Promise<IParentescoReturnDto | null> {
        return await this.prisma.parentesco.findUnique({
            where,
            select: { id: true, descripcion: true },
        });
    }

    async parentescos(): Promise<IParentescoReturnDto[]> {
        return await this.prisma.parentesco.findMany({
            select: { id: true, descripcion: true },
        });
    }

    async createParentesco(data: Prisma.ParentescoCreateInput): Promise<IParentescoReturnDto> {
        return await this.prisma.parentesco.create({
            data,
            select: { id: true, descripcion: true },
        });
    }

    async updateParentesco(params: {
        where: Prisma.ParentescoWhereUniqueInput;
        data: Prisma.ParentescoUpdateInput;
    }): Promise<IParentescoReturnDto> {
        const { where, data } = params;
        return await this.prisma.parentesco.update({
            data,
            where,
            select: { id: true, descripcion: true },
        });
    }

    async deleteParentesco(where: Prisma.ParentescoWhereUniqueInput): Promise<IParentescoReturnDto> {
        return this.prisma.parentesco.delete({
            where,
            select: { id: true, descripcion: true },
        });
    }
}
