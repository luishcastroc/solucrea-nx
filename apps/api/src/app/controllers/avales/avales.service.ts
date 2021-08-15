import { CreateAvalDto } from './../../dtos/create-aval.dto';
import { Aval, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvalesService {
    constructor(private prisma: PrismaService) {}

    async aval(avalWhereUniqueInput: Prisma.AvalWhereUniqueInput): Promise<Aval | null> {
        return this.prisma.aval.findUnique({
            where: avalWhereUniqueInput,
        });
    }

    async avales(): Promise<Aval[]> {
        return this.prisma.aval.findMany();
    }

    async createAval(data: CreateAvalDto): Promise<Aval> {
        return this.prisma.aval.create({
            data,
        });
    }

    async updateAval(params: { where: Prisma.AvalWhereUniqueInput; data: Prisma.AvalUpdateInput }): Promise<Aval> {
        const { where, data } = params;
        return this.prisma.aval.update({
            data,
            where,
        });
    }

    async deleteAval(where: Prisma.AvalWhereUniqueInput): Promise<Aval> {
        return this.prisma.aval.delete({
            where,
        });
    }
}
