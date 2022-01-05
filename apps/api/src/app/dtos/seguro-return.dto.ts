import { Decimal } from '@prisma/client/runtime';

export interface ISeguroReturnDto {
    id: string;
    nombre: string;
    monto: Decimal;
}
