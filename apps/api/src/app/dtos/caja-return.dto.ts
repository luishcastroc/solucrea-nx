import { Decimal } from '@prisma/client/runtime';
import { MovimientoDeCaja, Sucursal } from '@prisma/client';
export interface ICajaReturnDto {
    id: string;
    saldoInicial: Decimal;
    fechaApertura: string | Date;
    saldoFinal: Decimal;
    fechaCierre: string | Date;
    creadoPor: string;
    sucursal: Partial<Sucursal>;
    saldoActual?: number;
    movimientos?: Partial<MovimientoDeCaja>[];
    observaciones: string;
}
