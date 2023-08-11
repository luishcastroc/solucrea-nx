import { Prisma } from '@prisma/client';

export interface IActividadEconomicaReturnDto {
  id: string;
  descripcion: string;
  montoMin: Prisma.Decimal;
  montoMax: Prisma.Decimal;
}
