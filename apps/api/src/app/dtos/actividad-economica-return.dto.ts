import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export interface IActividadEconomicaReturnDto {
  id: string;
  descripcion: string;
  montoMin: Prisma.Decimal;
  montoMax: Prisma.Decimal;
}
