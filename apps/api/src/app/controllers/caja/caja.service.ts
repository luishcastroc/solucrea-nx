import { Prisma } from '@prisma/client';
import { Caja } from '.prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCajaDto, ICajaReturnDto } from 'api/dtos';
import { isEmpty } from 'lodash';

@Injectable()
export class CajaService {
    select = {
        id: true,
        saldoInicial: true,
        fechaApertura: true,
        saldoFinal: true,
        fechaCierre: true,
        creadoPor: true,
        sucursal: { select: { id: true, nombre: true } },
    };

    constructor(private prisma: PrismaService) {}

    async caja(cajaWhereUniqueInput: Prisma.CajaWhereUniqueInput): Promise<ICajaReturnDto | null> {
        const cajaReturn = await this.prisma.caja.findUnique({
            where: cajaWhereUniqueInput,
            select: this.select,
        });

        if (!cajaReturn) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, message: 'El registro de Caja no existe' },
                HttpStatus.NOT_FOUND
            );
        }
        return cajaReturn;
    }

    async cajas(): Promise<ICajaReturnDto[]> {
        try {
            return this.prisma.caja.findMany({
                select: this.select,
                where: {
                    fechaCierre: { equals: null },
                },
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando las cajas' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createCaja(data: CreateCajaDto): Promise<ICajaReturnDto> {
        const cajaCreate: Prisma.CajaCreateInput = {
            ...data,
            sucursal: { connect: { id: data.sucursal } },
        };

        const checkCaja = await this.prisma.caja.findFirst({
            where: {
                fechaCierre: { equals: null },
                sucursal: { id: { equals: data.sucursal } },
            },
        });

        if (checkCaja) {
            throw new HttpException(
                { status: HttpStatus.FOUND, message: 'Error ya existe turno abierto para esta sucursal, Verificar.' },
                HttpStatus.FOUND
            );
        }

        try {
            return await this.prisma.caja.create({ data: cajaCreate, select: this.select });
        } catch (e) {
            console.log(e);
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando la caja.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateCaja(params: {
        where: Prisma.CajaWhereUniqueInput;
        data: Prisma.CajaUpdateInput;
    }): Promise<ICajaReturnDto> {
        const { where, data } = params;
        const cajaUpdate: Prisma.CajaUpdateInput = { ...(data as Prisma.CajaUpdateInput) };

        if (isEmpty(data)) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Error actualizando el turno, al menos un elemento a actualizar debe ser provisto',
                },
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            return this.prisma.caja.update({
                data: cajaUpdate,
                where,
                select: this.select,
            });
        } catch (e) {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error actualizando el turno' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteCaja(where: Prisma.CajaWhereUniqueInput): Promise<ICajaReturnDto> {
        try {
            return this.prisma.caja.delete({
                where,
                select: this.select,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error borrando la caja.' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
