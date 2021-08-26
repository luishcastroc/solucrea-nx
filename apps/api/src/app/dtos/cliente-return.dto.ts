import { Decimal } from '@prisma/client/runtime';

export interface IClienteReturnDto {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaDeNacimiento: Date;
    generoId: string;
    escolaridadId: string;
    estadoCivilId: string;
    tipoDeViviendaId: string;
    montoMinimo: Decimal;
    montoMaximo: Decimal;
    numeroCreditosCrecer: number;
    direcciones: {
        id: string;
        calle: string;
        numero: string;
        cruzamientos: string;
        coloniaId: string;
    }[];
    trabajo: {
        id: string;
        nombre: string;
        antiguedad: number;
        actividadEconomicaId: string;
        direccion: {
            id: string;
            calle: string;
            numero: string;
            cruzamientos: string;
            coloniaId: string;
        };
    };
}
