import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cliente, Direccion, Prisma } from '@prisma/client';
import { CreateClienteDto, CreateDireccionDto, IClienteReturnDto, UpdateClienteDto } from 'api/dtos';
import { selectCliente } from 'api/util';
import { isEmpty } from 'lodash';

import { IDireccionUpdateDto, ITrabajoDto } from '../../dtos/update-cliente.dto';
import { PrismaService } from 'api/prisma';

/* eslint-disable @typescript-eslint/naming-convention */
@Injectable()
export class ClientesService {
    constructor(private prisma: PrismaService) {}

    async cliente(where: Prisma.ClienteWhereUniqueInput): Promise<IClienteReturnDto | null> {
        const select = selectCliente;
        const clienteReturn = await this.prisma.cliente.findUnique({
            where,
            select,
        });

        if (!clienteReturn) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, message: 'el cliente no existe, verificar' },
                HttpStatus.NOT_FOUND
            );
        }

        return clienteReturn as IClienteReturnDto;
    }

    async clientes(): Promise<IClienteReturnDto[]> {
        const select = selectCliente;
        try {
            const clientesReturn = await this.prisma.cliente.findMany({
                select,
            });
            if (!clientesReturn) {
                return [];
            }
            return clientesReturn as IClienteReturnDto[];
        } catch (e: any) {
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error consultando clientes' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async createCliente(data: CreateClienteDto): Promise<IClienteReturnDto> {
        const select = selectCliente;
        const existCliente = await this.prisma.cliente.findMany({
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
        const direccionesCreate: Prisma.DireccionCreateManyClienteInput[] | undefined = direcciones?.map(
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
            porcentajeDePagos: data.porcentajeDePagos,
            porcentajeDeMora: data.porcentajeDeMora,
            multiplos: data.multiplos,
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
                select,
            });
        } catch (e) {
            console.log(e);
            if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al agregar al cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async updateCliente(params: {
        where: Prisma.ClienteWhereUniqueInput;
        data: UpdateClienteDto;
    }): Promise<IClienteReturnDto> {
        const { where, data } = params;
        const select = selectCliente;

        let dataToUpdate: Prisma.ClienteUpdateInput;

        if (isEmpty(data)) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Error actualizando cliente, al menos un elemento a actualizar debe ser provisto',
                },
                HttpStatus.BAD_REQUEST
            );
        }

        for (const field of Object.keys(data)) {
            switch (field) {
                case 'direcciones':
                    if (data[field]) {
                        const direcciones = this.getDirecciones(data.direcciones, data.actualizadoPor);
                        dataToUpdate = { ...dataToUpdate, direcciones };
                    }
                    break;
                case 'trabajo':
                    if (data[field]) {
                        const trabajo = this.getTrabajo(data.trabajo);
                        dataToUpdate = { ...dataToUpdate, trabajo };
                    }
                    break;
                case 'estadoCivil':
                    if (data[field]) {
                        const estadoCivil = { connect: { id: data.estadoCivil } };
                        dataToUpdate = { ...dataToUpdate, estadoCivil };
                    }
                    break;
                case 'genero':
                    if (data[field]) {
                        const genero = { connect: { id: data.genero } };
                        dataToUpdate = { ...dataToUpdate, genero };
                    }
                    break;
                case 'escolaridad':
                    if (data[field]) {
                        const escolaridad = { connect: { id: data.escolaridad } };
                        dataToUpdate = { ...dataToUpdate, escolaridad };
                    }
                    break;
                case 'tipoDeVivienda':
                    if (data[field]) {
                        const tipoDeVivienda = { connect: { id: data.tipoDeVivienda } };
                        dataToUpdate = { ...dataToUpdate, tipoDeVivienda };
                    }
                    break;
                default:
                    dataToUpdate = { ...dataToUpdate, [field]: data[field] };
            }
        }

        try {
            const updateStatement = await this.prisma.cliente.update({
                data: dataToUpdate,
                where,
                select,
            });

            return updateStatement;
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error actualizando el cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
        }
    }

    async deleteCliente(params: {
        where: Prisma.ClienteWhereUniqueInput;
        data: Prisma.ClienteUpdateInput;
    }): Promise<IClienteReturnDto> {
        const { where, data } = params;
        const select = selectCliente;
        data.activo = false;
        try {
            const cliente = await this.prisma.cliente.findUnique({ where });
            if (!cliente) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        message: 'Error inhabilitando al cliente, el cliente no existe',
                    },
                    HttpStatus.NOT_FOUND
                );
            }
            const updateStatement = await this.prisma.cliente.update({
                data,
                where,
                select,
            });

            return updateStatement;
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error inhablilitando el cliente' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
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

    async getClientesByWhere(data: string): Promise<IClienteReturnDto[]> {
        const select = selectCliente;
        const where: Prisma.ClienteWhereInput = {
            OR: [
                { nombre: { contains: data } },
                { apellidoPaterno: { contains: data } },
                {
                    apellidoMaterno: { contains: data },
                },
                { curp: { contains: data } },
                { rfc: { contains: data } },
            ],
        };
        try {
            return this.prisma.cliente.findMany({ where, select });
        } catch (e) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error obteniendo los clientes.' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    async getClientesCount(): Promise<number> {
        try {
            const clientesSum = await this.prisma.cliente.aggregate({ _count: true });
            return clientesSum._count;
        } catch (e) {
            if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error contando los clientes' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
            }
        }
    }

    private getDirecciones(
        data: IDireccionUpdateDto,
        actualizadoPor: string
    ): Prisma.DireccionUpdateManyWithoutClienteInput {
        let direcciones: Prisma.DireccionUpdateManyWithoutClienteInput;
        const { deleteDireccion, create, update } = data;
        if (update && update.length > 0) {
            direcciones = {
                ...direcciones,
                update: update.map(({ id, calle, numero, cruzamientos, coloniaId }) => {
                    const updateReturn = { where: { id }, data: {} };
                    if (calle) {
                        updateReturn.data = { ...updateReturn.data, calle };
                    }
                    if (numero) {
                        updateReturn.data = { ...updateReturn.data, numero };
                    }
                    if (cruzamientos) {
                        updateReturn.data = { ...updateReturn.data, cruzamientos };
                    }
                    if (coloniaId) {
                        updateReturn.data = { ...updateReturn.data, colonia: { connect: { id: coloniaId } } };
                    }
                    return updateReturn;
                }),
            };
        }

        if (create && create) {
            const dataCreate: Prisma.DireccionCreateManyClienteInput[] = create.map(
                ({ numero, calle, cruzamientos, colonia, tipo }: CreateDireccionDto) =>
                    ({
                        tipo,
                        numero,
                        calle,
                        cruzamientos,
                        coloniaId: colonia,
                        creadoPor: actualizadoPor,
                    } as Prisma.DireccionCreateManyClienteInput)
            );

            direcciones = {
                ...direcciones,
                createMany: {
                    data: dataCreate,
                },
            };
        }
        if (deleteDireccion && deleteDireccion.length > 0) {
            direcciones = { ...direcciones, delete: deleteDireccion as Prisma.DireccionWhereUniqueInput };
        }

        return direcciones;
    }

    private getTrabajo(trabajo: ITrabajoDto): Prisma.TrabajoUpdateOneRequiredWithoutClienteInput {
        let trabajoReturn: Prisma.TrabajoUpdateOneRequiredWithoutClienteInput;
        const { nombre, telefono, antiguedad, direccion, actividadEconomica } = trabajo;
        let update: Prisma.TrabajoUpdateWithoutClienteInput;
        let direccionUpdate: Prisma.DireccionUpdateWithoutTrabajoInput;

        if (nombre) {
            update = { ...update, nombre };
            trabajoReturn = { ...trabajoReturn, update };
        }
        if (telefono) {
            update = { ...update, telefono };
            trabajoReturn = { ...trabajoReturn, update };
        }
        if (antiguedad) {
            update = { ...update, antiguedad };
            trabajoReturn = { ...trabajoReturn, update };
        }
        if (actividadEconomica) {
            update = { ...update, actividadEconomica: { connect: { id: actividadEconomica } } };
            trabajoReturn = { ...trabajoReturn, update };
        }

        if (direccion) {
            const { codigoPostal, colonia, ...rest } = direccion;
            if (direccion?.calle) {
                const { calle } = direccion;
                direccionUpdate = { ...rest, calle };
            }
            if (direccion?.numero) {
                const { numero } = direccion;
                direccionUpdate = { ...rest, numero };
            }
            if (direccion?.cruzamientos) {
                const { cruzamientos } = direccion;
                direccionUpdate = { ...rest, cruzamientos };
            }
            if (direccion?.colonia) {
                direccionUpdate = { ...rest, colonia: { connect: { id: colonia } } };
            }
            const direccionTrabajo = {
                update: direccionUpdate,
            };

            update = { ...update, direccion: direccionTrabajo };
            trabajoReturn = { ...trabajoReturn, update };
        }

        return trabajoReturn;
    }
}
