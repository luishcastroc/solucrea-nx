import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pago, Prisma } from '@prisma/client';
import { PrismaService } from 'api/prisma';

@Injectable()
export class PagosService {
    constructor(private prisma: PrismaService) {}

    // Pagos

    async pago(where: Prisma.PagoWhereUniqueInput): Promise<Pago | null> {
        return await this.prisma.pago.findUnique({
            where,
        });
    }

    async pagos(creditoId: string): Promise<Pago[]> {
        return await this.prisma.pago.findMany({ where: { creditoId } });
    }

    async createPago(data: Prisma.PagoCreateInput): Promise<Pago> {
        try {
            const { credito } = data;
            let pago: Pago;
            if (credito && credito.connect) {
                const {
                    connect: { id },
                } = credito;
                const currentCredito = await this.prisma.credito.findUnique({
                    where: { id },
                    include: { pagos: true },
                });
                console.log('currentCredito: ', currentCredito);
                if (!currentCredito) {
                    throw new HttpException(
                        { status: HttpStatus.NOT_FOUND, message: 'Error al crear el pago, crédito no encontrado' },
                        HttpStatus.NOT_FOUND
                    );
                }
                pago = await this.prisma.pago.create({
                    data,
                });
                console.log('currentCredito: ', currentCredito);
                if (!pago) {
                    throw new HttpException(
                        { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al crear el pago' },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }

                const { saldo, pagos } = currentCredito;

                const sumPagos = pagos.reduce(
                    (previousValue, currentValue) => previousValue + currentValue.monto.toNumber(),
                    0
                );

                console.log('sumPagos: ', sumPagos);

                if (saldo) {
                    console.log('suma: ', saldo.toNumber() - sumPagos);
                    if (saldo.toNumber() - sumPagos === 0) {
                        const updatedCredito = await this.prisma.credito.update({
                            where: { id },
                            data: { fechaLiquidacion: pago.fechaCreacion },
                        });
                        if (!updatedCredito) {
                            throw new HttpException(
                                {
                                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                                    message: 'Error al actualizar el crédito con fecha final',
                                },
                                HttpStatus.INTERNAL_SERVER_ERROR
                            );
                        }
                    }
                }

                return pago;
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Error al crear el pago, el crédito no puede estar vacío ',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
        } catch (e: any) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al crear el pago' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async updatePago(params: { where: Prisma.PagoWhereUniqueInput; data: Prisma.PagoUpdateInput }): Promise<Pago> {
        const { where, data } = params;
        return await this.prisma.pago.update({
            data,
            where,
        });
    }

    async deletePago(where: Prisma.PagoWhereUniqueInput): Promise<Pago> {
        return this.prisma.pago.delete({
            where,
        });
    }
}
