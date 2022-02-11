import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateGeneroDto implements Prisma.GeneroCreateInput {
    @IsNotEmpty({ message: 'Descripcción es requerida.' })
    descripcion!: string;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    clientes?: Prisma.ClienteCreateNestedManyWithoutGeneroInput;
}
