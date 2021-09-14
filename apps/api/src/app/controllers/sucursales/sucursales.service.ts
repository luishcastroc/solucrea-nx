import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Prisma, Sucursal } from '@prisma/client';
import { CreateSucursalDto } from 'api/dtos';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SucursalesService {
    constructor(private prisma: PrismaService) {}

    async sucursal(sucursalWhereUniqueInput: Prisma.SucursalWhereUniqueInput): Promise<Sucursal | null> {
        try {
            const sucursalReturn = this.prisma.sucursal.findUnique({
                where: sucursalWhereUniqueInput,
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

    async sucursales(): Promise<Sucursal[]> {
        try {
            return this.prisma.sucursal.findMany();
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando las sucursales' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createSucursal(sucursal: CreateSucursalDto): Promise<Sucursal> {
        const { nombre, telefono, direccion: direccionDto, creadoPor } = sucursal;
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
        data: Prisma.SucursalUpdateInput;
    }): Promise<Sucursal> {
        const { where, data } = params;
        return this.prisma.sucursal.update({
            data,
            where,
        });
    }

    async deleteSucursal(where: Prisma.SucursalWhereUniqueInput): Promise<Sucursal> {
        try {
            return this.prisma.sucursal.delete({
                where,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error borrando la sucursal' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
