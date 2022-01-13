import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
        observaciones: true,
        colocador: true,
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
            return this.prisma.credito.create({ data, select: this.select });
        } catch (e) {
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
