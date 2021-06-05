import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateCodigoPostalDto implements Prisma.CodigoPostalCreateInput {
    @IsNotEmpty({ message: 'Código postal es requerido.' })
    codigoPostal: string;
    @IsNotEmpty({ message: 'Estado es requerido.' })
    estado: Prisma.EstadoCreateNestedOneWithoutCodigoPostalInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    ciudades?: Prisma.CiudadCreateNestedManyWithoutCodigosPostalesInput;
    fraccionamiento?: Prisma.FraccionamientoCreateNestedManyWithoutCodigoPostalInput;
    direccion?: Prisma.DireccionCreateNestedManyWithoutCodigoPostalInput;
}
