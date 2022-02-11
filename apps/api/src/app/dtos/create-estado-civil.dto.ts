import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateEstadoCivilDto implements Prisma.EstadoCivilCreateInput {
    @IsNotEmpty({ message: 'Descripcción es requerida.' })
    descripcion!: string;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    clientes?: Prisma.ClienteCreateNestedManyWithoutEstadoCivilInput;
}
