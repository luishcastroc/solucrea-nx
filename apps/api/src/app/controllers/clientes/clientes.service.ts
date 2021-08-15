import { Injectable } from '@nestjs/common';
import { Cliente, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientesService {
    constructor(private prisma: PrismaService) {}

    async cliente(where: Prisma.ClienteWhereUniqueInput): Promise<Cliente | null> {
        return await this.prisma.cliente.findUnique({
            where,
            include: {
                genero: true,
                direcciones: true,
                estadoCivil: true,
                tipoDeVivienda: true,
                escolaridad: true,
            },
        });
    }

    async clientes(): Promise<Cliente[]> {
        return await this.prisma.cliente.findMany({
            include: {
                genero: true,
                direcciones: true,
                estadoCivil: true,
                tipoDeVivienda: true,
                escolaridad: true,
            },
        });
    }

    async createCliente(data: Prisma.ClienteCreateInput): Promise<Cliente> {
        return await this.prisma.cliente.create({
            data,
        });
    }

    async updateCliente(params: {
        where: Prisma.ClienteWhereUniqueInput;
        data: Prisma.ClienteUpdateInput;
    }): Promise<Cliente> {
        const { where, data } = params;
        return await this.prisma.cliente.update({
            data,
            where,
        });
    }

    async deleteCliente(where: Prisma.ClienteWhereUniqueInput): Promise<Cliente> {
        return this.prisma.cliente.delete({
            where,
        });
    }

    async searchClientesByCurp(where: Prisma.ClienteWhereUniqueInput): Promise<Cliente> {
        return this.prisma.cliente.findUnique({
            where,
            include: {
                genero: true,
                direcciones: true,
                estadoCivil: true,
                tipoDeVivienda: true,
                escolaridad: true,
            },
        });
    }
}
