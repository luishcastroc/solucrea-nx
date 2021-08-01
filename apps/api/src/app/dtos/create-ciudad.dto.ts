import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateCiudadDto implements Prisma.CiudadCreateInput {
    @IsNotEmpty({ message: 'Descripción es requerida.' })
    descripcion: string;
    @IsNotEmpty({ message: 'Estado es requerido.' })
    estado: Prisma.EstadoCreateNestedOneWithoutCiudadInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
