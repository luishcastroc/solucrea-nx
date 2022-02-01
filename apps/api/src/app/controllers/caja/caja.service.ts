import { Caja } from '.prisma/client';
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCajaDto, ICajaReturnDto } from 'api/dtos';
import { isEmpty, sumBy } from 'lodash';

import { PrismaService } from 'api/prisma';
import { UtilService } from 'api/util';

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
        movimientos: { select: { id: true, monto: true, tipo: true, observaciones: true } },
    };

    constructor(private prisma: PrismaService, private utilService: UtilService) {}

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

        const saldoActual = this.utilService.getSaldoActual(cajaReturn);

        const caja: ICajaReturnDto = { ...cajaReturn, saldoActual };

        return caja;
    }

    async cajas(): Promise<ICajaReturnDto[]> {
        try {
            const cajas = await this.prisma.caja.findMany({
                select: this.select,
                where: {
                    fechaCierre: { equals: null },
                },
            });

            let cajasReturn;
            if (cajas.length > 0) {
                cajasReturn = cajas.map((caja) => {
                    const saldoActual = this.utilService.getSaldoActual(caja);
                    return { ...caja, saldoActual };
                });
            }

            return cajasReturn;
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
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando el turno' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
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
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error actualizando el turno' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
        }
    }

    async deleteCaja(where: Prisma.CajaWhereUniqueInput): Promise<ICajaReturnDto> {
        try {
            return this.prisma.caja.delete({
                where,
                select: this.select,
            });
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error borrando el turno' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
        }
    }

    async getCajasCount(): Promise<number> {
        try {
            const cajasSum = await this.prisma.caja.aggregate({
                _count: true,
                where: { fechaCierre: { equals: null } },
            });
            return cajasSum._count;
        } catch (e) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error contando los turnos' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }
}
