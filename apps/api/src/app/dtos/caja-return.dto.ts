import { Sucursal } from '@prisma/client';
export interface ICajaReturnDto {
    id: string;
    saldoInicial: number;
    fechaApertura: string | Date;
    saldoFinal: number;
    fechaDeCierre: string | Date;
    creadoPor: string;
    fechaCreacion: string | Date;
    sucursal: Partial<Sucursal>;
}
