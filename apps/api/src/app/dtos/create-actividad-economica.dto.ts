import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateActividadEconomicaDto implements Prisma.ActividadEconomicaCreateInput {
    @IsNotEmpty({ message: 'Descripción es requerida.' })
    descripcion!: string;
    @IsNotEmpty({ message: 'Monto mínimo es requerido.' })
    montoMin!: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Monto máximo es requerido.' })
    montoMax!: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Ciclo escalonado es requerido.' })
    cicloEscalonado!: number;
    trabajo?: Prisma.TrabajoCreateNestedManyWithoutActividadEconomicaInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
