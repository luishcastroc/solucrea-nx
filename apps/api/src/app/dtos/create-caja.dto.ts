import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateCajaDto implements Prisma.CajaCreateInput {
    @IsNotEmpty({ message: 'Saldo inicial es requerido.' })
    saldoInicial: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Sucursal es requerida.' })
    sucursal: Prisma.SucursalCreateNestedOneWithoutCajasInput;
    observaciones: string;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    movimientos?: Prisma.MovimientoDeCajaCreateNestedManyWithoutCajaInput;
}
