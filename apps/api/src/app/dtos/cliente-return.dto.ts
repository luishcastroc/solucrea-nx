import { Decimal } from '@prisma/client/runtime';

import { IColonias } from './colonia-return.dto';

export interface IDireccionesReturnDto {
    id: string;
    calle: string;
    numero: string;
    cruzamientos: string;
    colonia: IColonias;
}

export interface ITrabajoReturn {
    id: string;
    nombre: string;
    antiguedad: number;
    actividadEconomicaId: string;
    telefono: string;
    direccion: IDireccionesReturnDto;
}

export interface IClienteReturnDto {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaDeNacimiento: Date;
    rfc: string;
    curp: string;
    generoId: string;
    escolaridadId: string;
    estadoCivilId: string;
    tipoDeViviendaId: string;
    montoMinimo: Decimal | number;
    montoMaximo: Decimal | number;
    telefono1: string;
    telefono2: string;
    numeroCreditosCrecer: number;
    porcentajeDePagos: Decimal | number;
    porcentajeDeMora: Decimal | number;
    multiplos: Decimal | number;
    direcciones: IDireccionesReturnDto[];
    trabajo: ITrabajoReturn;
    activo: boolean;
}
