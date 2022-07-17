/* eslint-disable @typescript-eslint/naming-convention */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateSucursalDto, ICajaReturnDto, ISucursalReturnDto, UpdateSucursalDto } from 'api/dtos';
import { PrismaService } from 'api/prisma';
import { isEmpty } from 'lodash';

@Injectable()
export class SucursalesService {
    select = {
        id: true,
        nombre: true,
        telefono: true,
        direccion: {
            select: {
                id: true,
                calle: true,
                numero: true,
                cruzamientos: true,
                colonia: { select: { id: true, descripcion: true, codigoPostal: true } },
            },
        },
        activa: true,
    };
    constructor(private prisma: PrismaService) {}

    async sucursal(sucursalWhereUniqueInput: Prisma.SucursalWhereUniqueInput): Promise<ISucursalReturnDto | null> {
        try {
            const sucursalReturn = this.prisma.sucursal.findUnique({
                where: sucursalWhereUniqueInput,
                select: this.select,
            });

            if (!sucursalReturn) {
                throw new HttpException(
                    { status: HttpStatus.NOT_FOUND, message: 'no existen sucursales' },
                    HttpStatus.NOT_FOUND
                );
            }

            return sucursalReturn;
        } catch (e: any) {
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando las sucursales' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async sucursales(): Promise<ISucursalReturnDto[]> {
        try {
            return this.prisma.sucursal.findMany({ select: this.select });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando las sucursales' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createSucursal(sucursal: CreateSucursalDto): Promise<ISucursalReturnDto> {
        const { nombre, telefono, direccion: direccionDto, creadoPor } = sucursal;
        const direccion: Prisma.DireccionCreateNestedOneWithoutSucursalesInput = {
            create: {
                tipo: 'SUCURSAL',
                calle: direccionDto.calle as string,
                numero: direccionDto.numero as string,
                cruzamientos: direccionDto.cruzamientos,
                colonia: { connect: { id: direccionDto.colonia } },
                creadoPor: creadoPor as string,
            },
        };

        const data: Prisma.SucursalCreateInput = { nombre, telefono, direccion, creadoPor };
        try {
            return this.prisma.sucursal.create({
                data,
                select: this.select,
            });
        } catch (e: any) {
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando la sucursal' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async updateSucursal(params: {
        where: Prisma.SucursalWhereUniqueInput;
        data: UpdateSucursalDto;
    }): Promise<ISucursalReturnDto> {
        const { where } = params;
        const { data } = params;
        let sucursalUpdate: Prisma.SucursalUpdateInput = { ...(data as Prisma.SucursalUpdateInput) };

        if (isEmpty(data)) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Error actualizando la sucursal, al menos un elemento a actualizar debe ser provisto',
                },
                HttpStatus.BAD_REQUEST
            );
        }

        if (data.direccion) {
            if (data.direccion.colonia) {
                const coloniaId = data.direccion.colonia;
                data.direccion = { ...data.direccion, coloniaId };
                delete data.direccion.colonia;
                delete data.direccion.codigoPostal;
            }
            const update: Prisma.DireccionUncheckedUpdateWithoutSucursalesInput = { ...data.direccion };
            const direccion: Prisma.DireccionUpdateOneRequiredWithoutSucursalesNestedInput = {
                update,
            };
            sucursalUpdate = { ...data, direccion };
        }

        try {
            return this.prisma.sucursal.update({
                data: sucursalUpdate,
                where,
                select: this.select,
            });
        } catch (e: any) {
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error actualizando la sucursal' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async deleteSucursal(where: Prisma.SucursalWhereUniqueInput): Promise<ISucursalReturnDto> {
        try {
            //get sucursal
            const sucursal: ISucursalReturnDto | null = await this.prisma.sucursal.findUnique({
                where,
                select: this.select,
            });

            if (!sucursal) {
                throw new HttpException(
                    { status: HttpStatus.NOT_FOUND, message: 'la sucursal no existe' },
                    HttpStatus.NOT_FOUND
                );
            }
            // disable the actual sucursal
            await this.prisma.sucursal.update({ where, data: { activa: false } });
            sucursal.activa = false;
            return sucursal;
        } catch (e: any) {
            const { response } = e;
            if (!response || response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error inhabilitando la sucursal' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
        }
    }

    async getSucursalesWithCaja(minAmount: number, maxAmount: number): Promise<Partial<ISucursalReturnDto>[]> {
        const cajas = await this.prisma.caja.findMany({
            where: { fechaCierre: { equals: null } },
            select: {
                id: true,
                saldoInicial: true,
                fechaApertura: true,
                sucursalId: true,
                sucursal: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        });

        let availableCajas: Partial<ICajaReturnDto>[] = [];
        for (const caja of cajas) {
            const pagos = await this.prisma.pago.aggregate({
                where: {
                    AND: [{ sucursalId: { equals: caja.sucursalId } }, { fechaDePago: { gte: caja.fechaApertura } }],
                },
                _sum: { monto: true },
            });
            const movimientos = await this.prisma.movimientoDeCaja.aggregate({
                where: { cajaId: { equals: caja.id } },
                _sum: { monto: true },
            });

            const saldoActual =
                Number(caja.saldoInicial) -
                (pagos._sum.monto ? Number(pagos._sum.monto) : 0) +
                (movimientos._sum.monto ? Number(movimientos._sum.monto) : 0);

            if ((saldoActual >= minAmount && saldoActual <= maxAmount) || saldoActual > maxAmount) {
                availableCajas = [
                    ...availableCajas,
                    {
                        ...caja,
                        saldoActual,
                    } as Partial<ICajaReturnDto>,
                ];
            }
        }

        let sucursalesReturn: Partial<ISucursalReturnDto>[] = [];
        for (const caja of availableCajas) {
            const sucursalWithCaja = await this.prisma.sucursal.findUnique({
                where: { id: caja.sucursal?.id },
                select: { id: true, nombre: true },
            });
            if (sucursalWithCaja) {
                sucursalesReturn = [...sucursalesReturn, sucursalWithCaja];
            }
        }

        return sucursalesReturn;
    }
}
