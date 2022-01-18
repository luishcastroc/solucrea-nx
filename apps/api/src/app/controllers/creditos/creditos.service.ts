/* eslint-disable @typescript-eslint/naming-convention */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Credito, Prisma } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CreditosService {
    select = {
        id: true,
        fechaDesembolso: true,
        fechaInicio: true,
        fechaFinal: true,
        fechaLiquidacion: true,
        monto: true,
        status: true,
        sucursal: { select: { id: true, nombre: true } },
        producto: {
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                montoMinimo: true,
                montoMaximo: true,
                interes: true,
                interesMoratorio: true,
                penalizacion: true,
                comision: true,
                cargos: true,
                activo: true,
                duracion: true,
                numeroDePagos: true,
                frecuencia: true,
                creditosActivos: true,
                diaSemana: true,
                diaMes: true,
            },
        },
        seguro: { select: { id: true, nombre: true, monto: true } },
        modalidadDeSeguro: { select: { id: true, titulo: true, descripcion: true } },
        observaciones: true,
        colocador: {
            select: {
                id: true,
                usuario: { select: { id: true, nombre: true, apellido: true } },
                cliente: { select: { id: true, apellidoPaterno: true, apellidoMaterno: true, nombre: true } },
            },
        },
        aval: {
            select: {
                id: true,
                nombre: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                telefono: true,
                fechaDeNacimiento: true,
                parentesco: true,
                otro: true,
                ocupacion: true,
            },
        },
        pagos: { select: { id: true, monto: true, fechaDePago: true, observaciones: true } },
    };
    constructor(private prisma: PrismaService) {}

    async creditosCliente(creditoWhereUniqueInput: Prisma.CreditoWhereInput): Promise<ICreditoReturnDto[] | null> {
        try {
            return this.prisma.credito.findMany({
                where: creditoWhereUniqueInput,
                select: this.select,
            });
        } catch (e) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando los créditos del cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async creditos(): Promise<ICreditoReturnDto[] | null> {
        try {
            return this.prisma.credito.findMany({
                select: this.select,
            });
        } catch (e) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando los créditos del cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async createCredito(data: Prisma.CreditoCreateInput): Promise<ICreditoReturnDto> {
        try {
            const creditosActivos = await this.prisma.credito.findMany({
                where: {
                    AND: [
                        { clienteId: { equals: data.cliente.connect.id } },
                        { productosId: { equals: data.producto.connect.id } },
                        { fechaLiquidacion: { equals: null } },
                    ],
                },
            });

            console.log('creditosActivos: ', creditosActivos);

            if (creditosActivos.length > 0) {
                const producto = await this.prisma.producto.findFirst({
                    select: { creditosActivos: true },
                    where: { id: { equals: data.producto.connect.id } },
                });

                console.log('producto: ', producto);

                if (creditosActivos.length + 1 > Number(producto.creditosActivos)) {
                    throw new HttpException(
                        {
                            status: HttpStatus.PRECONDITION_FAILED,
                            message: `Error el cliente solo puede tener ${producto.creditosActivos} ${
                                Number(producto.creditosActivos) === 1 ? 'crédito activo' : 'créditos activos'
                            }`,
                        },
                        HttpStatus.PRECONDITION_FAILED
                    );
                }
            }

            const creditoCreado = await this.prisma.credito.create({ data, select: this.select });

            return creditoCreado;
        } catch (e) {
            console.log('error: ', e);
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando el nuevo crédito' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }
}
