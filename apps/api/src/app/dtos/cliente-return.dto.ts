import { IColonias } from './colonia-return.dto';
import { Decimal } from '@prisma/client/runtime';

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
    montoMinimo: Decimal;
    montoMaximo: Decimal;
    telefono1: string;
    telefono2: string;
    numeroCreditosCrecer: number;
    direcciones: {
        id: string;
        calle: string;
        numero: string;
        cruzamientos: string;
        colonia: IColonias;
    }[];
    trabajo: {
        id: string;
        nombre: string;
        antiguedad: number;
        actividadEconomicaId: string;
        telefono: string;
        direccion: {
            id: string;
            calle: string;
            numero: string;
            cruzamientos: string;
            colonia: IColonias;
        };
    };
}
