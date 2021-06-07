import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateAvalDto implements Prisma.AvalCreateInput {
    @IsNotEmpty({ message: 'Nombre es requerido.' })
    nombre: string;
    @IsNotEmpty({ message: 'Apellidos son requeridos.' })
    apellidos: string;
    @IsNotEmpty({ message: 'Teléfono es requerido.' })
    telefono: string;
    @IsNotEmpty({ message: 'Fecha de nacimiento es requerida.' })
    fechaDeNacimiento: string | Date;
    @IsNotEmpty({ message: 'Parentesco es requerida.' })
    parentesco: Prisma.ParentescoCreateNestedOneWithoutAvalesInput;
    @IsNotEmpty({ message: 'Ocupación es requerida.' })
    ocupacion: Prisma.OcupacionCreateNestedOneWithoutAvalesInput;
    creadoPor: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    creditos?: Prisma.CreditoCreateNestedManyWithoutAvalInput;
}
