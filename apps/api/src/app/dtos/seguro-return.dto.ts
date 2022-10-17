import { Prisma } from '@prisma/client';

export interface ISeguroReturnDto {
  id: string;
  nombre: string;
  monto: Prisma.Decimal;
}
