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
            const pago = await this.prisma.pago.create({
                data,
            });

            return pago;
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
