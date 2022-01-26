import { Parentesco } from '.prisma/client';

export interface IAvalReturnDto {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    fechaDeNacimiento: Date | string;
    parentesco: Partial<Parentesco>;
    otro: string;
    ocupacion: string;
    creadoPor: string;
    fechaCreacion: Date | string;
    actualizadoPor: string;
    fechaActualizacion: Date | string;
}
