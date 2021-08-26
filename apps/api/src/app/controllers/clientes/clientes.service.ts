import { IClienteReturnDto } from './../../dtos/cliente-return.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Cliente, Direccion, Prisma } from '@prisma/client';
import { CreateClienteDto } from 'api/dtos';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientesService {
    select = {
        id: true,
        nombre: true,
        apellidoPaterno: true,
        apellidoMaterno: true,
        fechaDeNacimiento: true,
        generoId: true,
        escolaridadId: true,
        estadoCivilId: true,
        tipoDeViviendaId: true,
        montoMinimo: true,
        montoMaximo: true,
        numeroCreditosCrecer: true,
        direcciones: {
            select: { id: true, calle: true, numero: true, cruzamientos: true, coloniaId: true },
        },
        trabajo: {
            select: {
                id: true,
                nombre: true,
                antiguedad: true,
                actividadEconomicaId: true,
                direccion: {
                    select: { id: true, calle: true, numero: true, cruzamientos: true, coloniaId: true },
                },
            },
        },
    };
    constructor(private prisma: PrismaService) {}

    async cliente(where: Prisma.ClienteWhereUniqueInput): Promise<IClienteReturnDto | null> {
        const clienteReturn = await this.prisma.cliente.findUnique({
            where,
            select: this.select,
        });

        if (!clienteReturn) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, message: 'el cliente no existe, verificar' },
                HttpStatus.NOT_FOUND
            );
        }

        return clienteReturn;
    }

    async clientes(): Promise<IClienteReturnDto[]> {
        try {
            const clientesReturn = await this.prisma.cliente.findMany({
                select: this.select,
            });
            if (!clientesReturn) {
                throw new HttpException(
                    { status: HttpStatus.NOT_FOUND, message: 'no existen clientes' },
                    HttpStatus.NOT_FOUND
                );
            }
            return clientesReturn;
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando clientes' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createCliente(data: CreateClienteDto): Promise<Cliente> {
        const existCliente = await this.prisma.cliente.findMany({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            where: { curp: data.curp, OR: [{ rfc: data.rfc }] },
        });
        if (existCliente.length > 0) {
            throw new HttpException(
                { status: HttpStatus.FOUND, message: 'El cliente ya existe, verificar' },
                HttpStatus.FOUND
            );
        }
        const fechaDeNacimiento = new Date(data.fechaDeNacimiento);
        const { direcciones, trabajo } = data;
        const { direccion } = trabajo;
        const direccionesCreate: Prisma.DireccionCreateManyClienteInput[] = direcciones.map(
            ({ numero, calle, cruzamientos, coloniaId, tipo }: Direccion) => ({
                tipo,
                numero,
                calle,
                cruzamientos,
                coloniaId,
                creadoPor: data.creadoPor,
            })
        );

        const clienteData: Prisma.ClienteCreateInput = {
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno,
            nombre: data.nombre,
            fechaDeNacimiento: fechaDeNacimiento.toISOString(),
            rfc: data.rfc,
            curp: data.curp,
            telefono1: data.telefono1,
            telefono2: data.telefono2,
            direcciones: { createMany: { data: direccionesCreate } },
            montoMinimo: data.montoMinimo,
            montoMaximo: data.montoMaximo,
            estadoCivil: { connect: { id: data.estadoCivil as string } },
            tipoDeVivienda: { connect: { id: data.tipoDeVivienda as string } },
            escolaridad: { connect: { id: data.escolaridad as string } },
            genero: { connect: { id: data.genero as string } },
            creadoPor: data.creadoPor,
            trabajo: {
                create: {
                    nombre: trabajo.nombre,
                    telefono: trabajo.telefono,
                    antiguedad: Number(trabajo.antiguedad),
                    direccion: {
                        create: {
                            tipo: 'TRABAJO',
                            calle: direccion.calle,
                            numero: direccion.numero,
                            cruzamientos: direccion.cruzamientos,
                            colonia: { connect: { id: direccion.coloniaId } },
                            creadoPor: data.creadoPor,
                        },
                    },
                    actividadEconomica: { connect: { id: trabajo.actividadEconomica } },
                    creadoPor: data.creadoPor,
                },
            },
        };

        try {
            return await this.prisma.cliente.create({
                data: clienteData,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al agregar cliente' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateCliente(params: {
        where: Prisma.ClienteWhereUniqueInput;
        data: Prisma.ClienteUpdateInput;
    }): Promise<Cliente> {
        const { where, data } = params;
        try {
            return await this.prisma.cliente.update({
                data,
                where,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al actualizar el cliente' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteCliente(where: Prisma.ClienteWhereUniqueInput): Promise<Cliente> {
        try {
            return this.prisma.cliente.delete({
                where,
            });
        } catch {
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al borrar el cliente' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async searchClientesByCurp(where: Prisma.ClienteWhereUniqueInput): Promise<Cliente> {
        const clienteSearch = this.prisma.cliente.findUnique({
            where,
            include: {
                genero: true,
                direcciones: true,
                estadoCivil: true,
                tipoDeVivienda: true,
                escolaridad: true,
            },
        });

        if (!clienteSearch) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, message: 'el cliente no existe, verificar' },
                HttpStatus.NOT_FOUND
            );
        }
        return clienteSearch;
    }
}
