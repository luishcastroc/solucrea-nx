import { IsNotEmpty } from 'class-validator';
import { Frecuencia, Prisma } from '@prisma/client';
export class CreateProductoDto implements Prisma.ProductoCreateInput {
    @IsNotEmpty({ message: 'Nombre es requerido.' })
    nombre: string;
    @IsNotEmpty({ message: 'Descripción es requerido.' })
    descripcion: string;
    @IsNotEmpty({ message: 'Monto mínimo es requerido.' })
    montoMinimo: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Monto máximo es requerido.' })
    montoMaximo: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Interes es requerido.' })
    interes: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Interes moratorio es requerido.' })
    interesMoratorio: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Penalización es requerida.' })
    penalizacion?: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Duración es requerido.' })
    duracion: number;
    @IsNotEmpty({ message: 'Número de pagos es requerido.' })
    numeroDePagos: number;
    @IsNotEmpty({ message: 'La frecuencia de pago es requerida.' })
    frecuencia: Frecuencia;
    diaSemana?: number;
    diaMes?: number;
    comision?: string | number | Prisma.Decimal;
    cargos?: string | number | Prisma.Decimal;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    id?: string;
    creditos?: Prisma.CreditoCreateNestedManyWithoutProductoInput;
}
