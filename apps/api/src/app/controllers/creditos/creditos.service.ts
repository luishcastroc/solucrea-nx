import { IClienteReturnDto } from './../../dtos/cliente-return.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pago, Prisma, Producto, Status, Seguro, Colocador, ModalidadDeSeguro } from '@prisma/client';
import { getSaldoActual, generateTablaAmorizacion, getFrecuencia } from '@solucrea-utils';
import { ICajaReturnDto, ICreditoReturnDto, IAmortizacion, ISucursalReturnDto, IAvalReturnDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';
import { selectCredito } from 'api/util';
import { Decimal } from '@prisma/client/runtime';

/* eslint-disable @typescript-eslint/naming-convention */
@Injectable()
export class CreditosService {
    constructor(private prisma: PrismaService) {}

    async creditosCliente(clienteId: string): Promise<ICreditoReturnDto[] | null> {
        try {
            const creditosCliente = await this.prisma.credito.findMany({
                where: { clienteId: { equals: clienteId } },
                select: selectCredito,
            });

            const creditosReturn = creditosCliente.map((credito) => {
                const frecuencia = getFrecuencia(credito?.producto.frecuencia);
                const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
                    credito?.producto.numeroDePagos as number,
                    frecuencia,
                    credito?.fechaInicio as string | Date,
                    credito?.cuota,
                    credito?.pagos as Partial<Pago>[] | Pago[]
                );
                const creditoReturn = {
                    ...credito,
                    amortizacion,
                };

                return creditoReturn;
            });

            return creditosReturn as ICreditoReturnDto[] | null;
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

    async creditos(): Promise<ICreditoReturnDto[] | null> {
        const select = selectCredito;
        try {
            const creditos = await this.prisma.credito.findMany({
                select,
            });

            const creditosReturn = creditos.map((credito) => {
                const frecuencia = getFrecuencia(credito?.producto.frecuencia);
                const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
                    credito?.producto.numeroDePagos as number,
                    frecuencia,
                    credito?.fechaInicio as string | Date,
                    credito?.cuota,
                    credito?.pagos as Partial<Pago>[] | Pago[]
                );
                const creditoReturn = {
                    ...credito,
                    amortizacion,
                };

                return creditoReturn as ICreditoReturnDto;
            });

            return creditosReturn;
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
            console.log('error: ', e);
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
