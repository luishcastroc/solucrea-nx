import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pago, Prisma, Status } from '@prisma/client';
import {
    generateTablaAmorizacion,
    getFrecuencia,
    getPagoNoIntereses,
    getSaldoActual,
    getSaldoVencido,
} from '@solucrea-utils';
import { IAmortizacion, ICajaReturnDto, ICreditoReturnDto, StatusPago } from 'api/dtos';
import { PrismaService } from 'api/prisma';
import { selectCredito } from 'api/util';

/* eslint-disable @typescript-eslint/naming-convention */
@Injectable()
export class CreditosService {
    constructor(private prisma: PrismaService) {}

    async creditosCliente(clienteId: string, statusCredito: Status): Promise<ICreditoReturnDto[] | null> {
        try {
            const creditosCliente = await this.prisma.credito.findMany({
                where: { clienteId: { equals: clienteId } },
                select: selectCredito,
            });

            const creditosReturn = await Promise.all(
                creditosCliente.map(async (credito) => {
                    const frecuencia = getFrecuencia(credito?.producto.frecuencia);
                    const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
                        credito?.producto.numeroDePagos as number,
                        frecuencia,
                        credito?.fechaInicio as string | Date,
                        credito?.cuota,
                        credito?.producto.interesMoratorio,
                        credito?.pagos as Partial<Pago>[] | Pago[]
                    );

                    let status;
                    if (amortizacion.filter((tabla) => tabla.status === StatusPago.adeuda).length > 0) {
                        status = Status.MORA;
                    } else if (
                        amortizacion.filter((tabla) => tabla.status === StatusPago.pagado).length ===
                        credito?.producto.numeroDePagos
                    ) {
                        status = Status.CERRADO;
                    } else if (
                        amortizacion.filter((tabla) => tabla.status === StatusPago.adeuda).length === 0 &&
                        amortizacion.some((tabla) => tabla.status === StatusPago.corriente)
                    ) {
                        status = Status.ABIERTO;
                    }

                    const saldoVencido = getSaldoVencido(amortizacion);
                    const saldo = amortizacion.reduce(
                        (acc, curr) =>
                            acc + (curr.status === 'ADEUDA' || curr.status === 'CORRIENTE' ? curr.monto.toNumber() : 0),
                        0
                    );

                    const creditoReturn = {
                        ...credito,
                        amortizacion,
                        status,
                        saldo,
                        saldoVencido,
                    };

                    if (status !== credito.status) {
                        await this.prisma.credito.update({ where: { id: credito.id }, data: { status } });
                    }

                    return creditoReturn as ICreditoReturnDto;
                })
            );

            return creditosReturn.filter((credito) => {
                if (statusCredito === 'ABIERTO' && (credito.status === 'ABIERTO' || credito.status === 'MORA')) {
                    return credito;
                } else if (statusCredito === credito.status) {
                    return credito;
                }
            });
        } catch (e: any) {
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

    async creditos(statusCredito: Status): Promise<ICreditoReturnDto[] | null> {
        const select = selectCredito;
        try {
            const creditos = await this.prisma.credito.findMany({
                select,
            });

            const creditosReturn = await Promise.all(
                creditos.map(async (credito) => {
                    const frecuencia = getFrecuencia(credito?.producto.frecuencia);
                    const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
                        credito?.producto.numeroDePagos as number,
                        frecuencia,
                        credito?.fechaInicio as string | Date,
                        credito?.cuota,
                        credito?.producto.interesMoratorio,
                        credito?.pagos as Partial<Pago>[] | Pago[]
                    );

                    let status;
                    if (amortizacion.filter((tabla) => tabla.status === StatusPago.adeuda).length > 0) {
                        status = Status.MORA;
                    } else if (
                        amortizacion.filter((tabla) => tabla.status === StatusPago.pagado).length ===
                        credito?.producto.numeroDePagos
                    ) {
                        status = Status.CERRADO;
                    } else if (
                        amortizacion.filter((tabla) => tabla.status === StatusPago.adeuda).length === 0 &&
                        amortizacion.some((tabla) => tabla.status === StatusPago.corriente)
                    ) {
                        status = Status.ABIERTO;
                    }

                    const saldoVencido = getSaldoVencido(amortizacion);
                    const saldo = amortizacion.reduce(
                        (acc, curr) =>
                            acc + (curr.status === 'ADEUDA' || curr.status === 'CORRIENTE' ? curr.monto.toNumber() : 0),
                        0
                    );

                    const creditoReturn = {
                        ...credito,
                        amortizacion,
                        status,
                        saldo,
                        saldoVencido,
                    };

                    if (status !== credito.status) {
                        await this.prisma.credito.update({ where: { id: credito.id }, data: { status } });
                    }

                    return creditoReturn as ICreditoReturnDto;
                })
            );

            return creditosReturn.filter((credito) => {
                if (statusCredito === 'ABIERTO' && (credito.status === 'ABIERTO' || credito.status === 'MORA')) {
                    return credito;
                } else if (statusCredito === credito.status) {
                    return credito;
                }
            });
        } catch (e: any) {
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

    async getCredito(id: string): Promise<ICreditoReturnDto | null> {
        const select = selectCredito;
        try {
            const credito = await this.prisma.credito.findUnique({ where: { id }, select });

            const frecuencia = getFrecuencia(credito?.producto.frecuencia);
            const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
                credito?.producto.numeroDePagos as number,
                frecuencia,
                credito?.fechaInicio as string | Date,
                credito?.cuota as Prisma.Decimal,
                credito?.producto.interesMoratorio as Prisma.Decimal,
                credito?.pagos as Partial<Pago>[] | Pago[]
            );

            let status;
            if (amortizacion.filter((tabla) => tabla.status === StatusPago.adeuda).length > 0) {
                status = Status.MORA;
            } else if (
                amortizacion.filter((tabla) => tabla.status === StatusPago.pagado).length ===
                credito?.producto.numeroDePagos
            ) {
                status = Status.CERRADO;
            } else if (
                amortizacion.filter((tabla) => tabla.status === StatusPago.adeuda).length === 0 &&
                amortizacion.some((tabla) => tabla.status === StatusPago.corriente)
            ) {
                status = Status.ABIERTO;
            }

            const saldoVencido = getSaldoVencido(amortizacion);
            const pagoNoIntereses = getPagoNoIntereses(amortizacion, credito?.cuota as Prisma.Decimal);
            const saldo = amortizacion.reduce(
                (acc, curr) =>
                    acc + (curr.status === 'ADEUDA' || curr.status === 'CORRIENTE' ? curr.monto.toNumber() : 0),
                0
            );

            const creditoReturn = {
                ...credito,
                amortizacion,
                status,
                saldo,
                saldoVencido,
                pagoNoIntereses,
            };

            if (status !== credito?.status) {
                await this.prisma.credito.update({ where: { id: credito?.id }, data: { status } });
            }

            return creditoReturn as ICreditoReturnDto;
        } catch (e: any) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando créditos del cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async getCreditosCount(id: string | null): Promise<number> {
        try {
            if (id === 'null') {
                id = null;
            }
            const creditosSum = id
                ? await this.prisma.credito.aggregate({ where: { clienteId: { equals: id } }, _count: true })
                : await this.prisma.credito.aggregate({ _count: true });
            return creditosSum._count;
        } catch (e: any) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error contando los créditos' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async createCredito(data: Prisma.CreditoCreateInput): Promise<ICreditoReturnDto> {
        const select = selectCredito;
        try {
            const creditosActivos = await this.prisma.credito.findMany({
                where: {
                    AND: [
                        { clienteId: { equals: data.cliente.connect?.id } },
                        { productosId: { equals: data.producto.connect?.id } },
                        { fechaLiquidacion: { equals: null } },
                    ],
                },
            });

            if (creditosActivos.length > 0) {
                const producto = await this.prisma.producto.findFirst({
                    select: { creditosActivos: true },
                    where: { id: { equals: data.producto.connect?.id } },
                });

                if (creditosActivos.length + 1 > Number(producto?.creditosActivos)) {
                    throw new HttpException(
                        {
                            status: HttpStatus.PRECONDITION_FAILED,
                            message: `Error el cliente solo puede tener ${producto?.creditosActivos} ${
                                Number(producto?.creditosActivos) === 1 ? 'crédito activo' : 'créditos activos'
                            }`,
                        },
                        HttpStatus.PRECONDITION_FAILED
                    );
                }
            }

            const saldoInicialCaja: Partial<ICajaReturnDto> | null = await this.prisma.caja.findFirst({
                where: {
                    AND: [{ sucursalId: { equals: data.sucursal.connect?.id } }, { fechaCierre: { equals: null } }],
                },
                select: {
                    id: true,
                    saldoInicial: true,
                    movimientos: { select: { monto: true, tipo: true, observaciones: true } },
                },
            });

            if (!saldoInicialCaja) {
                throw new HttpException(
                    {
                        status: HttpStatus.PRECONDITION_FAILED,
                        message: `Error no hay un turno abierto para otorgar el monto $${data.monto}, verificar. `,
                    },
                    HttpStatus.PRECONDITION_FAILED
                );
            }

            const saldo = getSaldoActual(saldoInicialCaja);

            if (saldo < Number(data.monto)) {
                throw new HttpException(
                    {
                        status: HttpStatus.PRECONDITION_FAILED,
                        message: `Error no hay suficiente efectivo en sucursal para otorgar el monto $${data.monto}, verificar. `,
                    },
                    HttpStatus.PRECONDITION_FAILED
                );
            }

            const creditoCreado = await this.prisma.credito.create({ data, select });

            if (creditoCreado) {
                //once credito is created we retire the money from the sucursal
                const caja = await this.prisma.caja.findFirst({
                    where: {
                        AND: [
                            { sucursalId: { equals: data.sucursal?.connect?.id } },
                            { fechaCierre: { equals: null } },
                        ],
                    },
                    select: { id: true },
                });
                //preparing movimiento
                const movimiento: Prisma.MovimientoDeCajaCreateInput = {
                    monto: creditoCreado.monto,
                    tipo: 'RETIRO',
                    observaciones: `Préstamo otorgado a ${creditoCreado.cliente.nombre} ${creditoCreado.cliente.apellidoPaterno} ${creditoCreado.cliente.apellidoMaterno}`,
                    creadoPor: data.creadoPor,
                    caja: { connect: { id: caja?.id } },
                };
                //retiring the money.
                const retiro = await this.prisma.movimientoDeCaja.create({ data: movimiento });

                if (retiro) {
                    return creditoCreado as ICreditoReturnDto;
                } else {
                    throw new HttpException(
                        {
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: `Error generando el retiro para el crédito ${creditoCreado.id}, verificar.`,
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            } else {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando crédito, verificar.' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        } catch (e: any) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando el nuevo crédito, verificar.' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }
}
