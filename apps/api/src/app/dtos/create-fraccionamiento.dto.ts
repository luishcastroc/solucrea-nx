import { Prisma, Role } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateFraccionamientoDto
    implements Prisma.FraccionamientoCreateInput {
    @IsNotEmpty({ message: 'la descripción es requerida' })
    descripcion: string;
    @IsNotEmpty({ message: 'Código postal es requerido' })
    codigoPostal: Prisma.CodigoPostalCreateNestedOneWithoutFraccionamientoInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
