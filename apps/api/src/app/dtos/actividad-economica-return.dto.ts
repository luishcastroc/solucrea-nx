import { Decimal } from '@prisma/client/runtime';

export interface IActividadEconomicaReturnDto {
    id: string;
    descripcion: string;
    montoMin: Decimal;
    montoMax: Decimal;
}
