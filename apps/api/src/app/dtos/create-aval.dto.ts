import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateAvalDto implements Prisma.AvalCreateInput {
    @IsNotEmpty({ message: 'Nombre es requerido.' })
    nombre: string;
    @IsNotEmpty({ message: 'Apellido paterno es requerido.' })
    apellidoPaterno: string;
    @IsNotEmpty({ message: 'Apellido materno es requerido.' })
    apellidoMaterno: string;
    @IsNotEmpty({ message: 'Teléfono es requerido.' })
    telefono: string;
    @IsNotEmpty({ message: 'Fecha de nacimiento es requerida.' })
    fechaDeNacimiento: string | Date;
    @IsNotEmpty({ message: 'Parentesco es requerida.' })
    parentesco: Prisma.ParentescoCreateNestedOneWithoutAvalInput;
    @IsNotEmpty({ message: 'Ocupación es requerida.' })
    ocupacion: string;
    id?: string;
    otro: string;
    creadoPor: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    creditos?: Prisma.CreditoCreateNestedManyWithoutAvalInput;
}
