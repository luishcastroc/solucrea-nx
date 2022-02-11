import { Prisma, TipoDireccion } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateDireccionDto implements Prisma.DireccionCreateInput {
    @IsNotEmpty({ message: 'Tipo de Dirección es requerido' })
    @IsEnum(TipoDireccion, { message: 'Tipo es inválido' })
    tipo!: TipoDireccion;
    @IsNotEmpty({ message: 'Calle es requerida' })
    calle!: string;
    @IsNotEmpty({ message: 'Número es requerido' })
    numero!: string;
    @IsNotEmpty({ message: 'Colonia es requerida' })
    colonia!: Prisma.ColoniaCreateNestedOneWithoutDireccionInput;
    id?: string;
    cruzamientos?: string;
    creadoPor!: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    sucursales?: Prisma.SucursalCreateNestedManyWithoutDireccionInput;
    cliente?: Prisma.ClienteCreateNestedOneWithoutDireccionesInput;
}
