import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateColoniaDto implements Prisma.ColoniaCreateInput {
    @IsNotEmpty({ message: 'Código postal es requerido' })
    codigoPostal!: string;
    @IsNotEmpty({ message: 'la descripción es requerida' })
    descripcion!: string;
    id?: string;
    ciudad?: Prisma.CiudadCreateNestedOneWithoutColoniasInput;
    direccion?: Prisma.DireccionCreateNestedManyWithoutColoniaInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
