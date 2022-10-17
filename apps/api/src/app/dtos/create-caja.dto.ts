import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateCajaDto {
  @IsNotEmpty({ message: 'Saldo inicial es requerido.' })
  saldoInicial!: string | number | Prisma.Decimal;
  @IsNotEmpty({ message: 'Fecha de apertura es requerida' })
  fechaApertura!: string | Date;
  @IsNotEmpty({ message: 'Sucursal es requerida.' })
  sucursal!: string;
  observaciones?: string;
  creadoPor!: string;
  fechaCreacion?: string | Date;
  actualizadoPor?: string;
  fechaActualizacion?: string | Date;
  movimientos?: Prisma.MovimientoDeCajaCreateNestedManyWithoutCajaInput;
}
