import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateSucursalDto, ISucursalReturnDto, UpdateSucursalDto } from 'api/dtos';
import { isEmpty } from 'lodash';

import { PrismaService } from '../../prisma/prisma.service';

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
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando la sucursal' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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
        console.log(sucursal);
        const direccion: Prisma.DireccionCreateNestedOneWithoutSucursalesInput = {
            create: {
                tipo: 'SUCURSAL',
                calle: direccionDto.calle,
                numero: direccionDto.numero,
                cruzamientos: direccionDto.cruzamientos,
                colonia: { connect: { id: direccionDto.colonia } },
                creadoPor,
            },
        };

        const data: Prisma.SucursalCreateInput = { nombre, telefono, direccion, creadoPor };
        try {
            return this.prisma.sucursal.create({
                data,
                select: this.select,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando la sucursal' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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
            const direccion: Prisma.DireccionUpdateOneRequiredWithoutSucursalesInput = {
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
        } catch (e) {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error actualizando la sucursal' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteSucursal(where: Prisma.SucursalWhereUniqueInput): Promise<ISucursalReturnDto> {
        try {
            //get sucursal
            const sucursal: ISucursalReturnDto = await this.prisma.sucursal.findUnique({ where, select: this.select });

            if (!sucursal) {
                throw new HttpException(
                    { status: HttpStatus.NOT_FOUND, message: 'la dirección de la sucursal no existe' },
                    HttpStatus.NOT_FOUND
                );
            }
            //delete the sucursal address first
            const deleteDireccionSucursal = await this.prisma.direccion.delete({
                where: { id: sucursal.direccion.id },
            });

            if (!deleteDireccionSucursal) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error borrando la sucursal' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            //delete the actual sucursal
            return sucursal;
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error borrando la sucursal' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
