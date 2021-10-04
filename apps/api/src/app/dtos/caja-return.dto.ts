import { Sucursal } from '@prisma/client';
export interface ICajaReturnDto {
    id: string;
    saldoInicial: number;
    creadoPor: string;
    fechaCreacion: string | Date;
    sucursal: Partial<Sucursal>;
}
