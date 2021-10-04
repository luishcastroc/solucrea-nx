import { Prisma } from '@prisma/client';
import { Caja } from '.prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCajaDto } from 'api/dtos';

@Injectable()
export class CajaService {
    constructor(private prisma: PrismaService) {}

    async caja(cajaWhereUniqueInput: Prisma.CajaWhereUniqueInput): Promise<Caja | null> {
        const cajaReturn = await this.prisma.caja.findUnique({
            where: cajaWhereUniqueInput,
        });

        if (!cajaReturn) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, message: 'El registro de Caja no existe' },
                HttpStatus.NOT_FOUND
            );
        }
        return cajaReturn;
    }

    async cajas(): Promise<Caja[]> {
        try {
            return this.prisma.caja.findMany({});
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando las cajas' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createCaja(data: CreateCajaDto): Promise<Caja> {
        const cajaCreate: Prisma.CajaCreateInput = {
            ...data,
            sucursal: { connect: { id: data.sucursal } },
        };
        try {
            return await this.prisma.caja.create({ data: cajaCreate });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando la caja.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateCaja(params: { where: Prisma.CajaWhereUniqueInput; data: Prisma.CajaUpdateInput }): Promise<Caja> {
        const { where, data } = params;
        return this.prisma.caja.update({
            data,
            where,
        });
    }

    async deleteCaja(where: Prisma.CajaWhereUniqueInput): Promise<Caja> {
        try {
            return this.prisma.caja.delete({
                where,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error borrando la caja.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
