import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pago, Prisma, TipoDePago } from '@prisma/client';
import { StatusPago } from 'api/dtos';
import { PrismaService } from 'api/prisma';
import { CreditosService } from '../creditos';

@Injectable()
export class PagosService {
    constructor(private prisma: PrismaService, private creditos: CreditosService) {}

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

                const currentCredito = await this.creditos.getCredito(id as string);

                if (!currentCredito) {
                    throw new HttpException(
                        { status: HttpStatus.NOT_FOUND, message: 'Error al crear el pago, crédito no encontrado' },
                        HttpStatus.NOT_FOUND
                    );
                }

                pago = await this.prisma.pago.create({
                    data,
                });

                if (!pago) {
                    throw new HttpException(
                        { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al crear el pago' },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }

                const { saldo, cuotaCapital, cuotaMora } = currentCredito;

                switch (pago.tipoDePago) {
                    case TipoDePago.ABONO:
                        console.log('abono');
                        break;
                    case TipoDePago.MORA:
                        console.log('mora');
                        break;
                    case TipoDePago.CAPITAL:
                        console.log('capital');
                        break;
                    case TipoDePago.LIQUIDACION:
                        console.log('liquidacion');
                        break;
                    default:
                        console.log('regular');
                        break;
                }

                // const auxSaldo = Math.floor(pago.monto.toNumber()/(cuotaCapital as Prisma.Decimal).toNumber());
                // if(auxSaldo > 0){

                // }

                // if (saldo) {
                //     console.log('suma: ', (saldo as Prisma.Decimal).toNumber() - sumPagos);
                //     if ((saldo as Prisma.Decimal).toNumber() - sumPagos === 0) {
                //         const updatedCredito = await this.prisma.credito.update({
                //             where: { id },
                //             data: { fechaLiquidacion: pago.fechaCreacion },
                //         });
                //         if (!updatedCredito) {
                //             throw new HttpException(
                //                 {
                //                     status: HttpStatus.INTERNAL_SERVER_ERROR,
                //                     message: 'Error al actualizar el crédito con fecha final',
                //                 },
                //                 HttpStatus.INTERNAL_SERVER_ERROR
                //             );
                //         }
                //     }
                // }

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
