import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CreditosService {
    select = {
        id: true,
        fechaInicio: true,
        fechaFinal: true,
        fechaLiquidacion: true,
        monto: true,
        status: true,
        creadoPor: true,
        fechaCreacion: true,
        actualizadoPor: true,
        fechaActualizacion: true,
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

    async credito(creditoWhereUniqueInput: Prisma.CreditoWhereInput): Promise<ICreditoReturnDto[] | null> {
        try {
            const creditoReturn = this.prisma.credito.findMany({
                where: creditoWhereUniqueInput,
                select: this.select,
            });

            if (!creditoReturn) {
                throw new HttpException(
                    { status: HttpStatus.NOT_FOUND, message: 'no existen créditos para el cliente.' },
                    HttpStatus.NOT_FOUND
                );
            }

            return creditoReturn;
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando los créditos del cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
        }
    }
}
