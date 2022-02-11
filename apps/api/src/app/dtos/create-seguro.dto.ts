import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateSeguroDto implements Prisma.SeguroCreateInput {
    @IsNotEmpty({ message: 'El nombre es requerido.' })
    nombre!: string;
    @IsNotEmpty({ message: 'El monto es requerido.' })
    monto!: string | number | Prisma.Decimal;
    id?: string;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    creditos?: Prisma.CreditoCreateNestedManyWithoutSeguroInput;
}
