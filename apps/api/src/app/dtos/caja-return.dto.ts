import { MovimientoDeCaja, Prisma, Sucursal } from '@prisma/client';

export interface ICajaReturnDto {
  id: string;
  saldoInicial: Prisma.Decimal;
  fechaApertura: string | Date;
  saldoFinal: Prisma.Decimal;
  fechaCierre: string | Date;
  creadoPor: string;
  sucursal: Partial<Sucursal>;
  saldoActual?: number;
  movimientos?: Partial<MovimientoDeCaja>[];
  observaciones: string;
}
