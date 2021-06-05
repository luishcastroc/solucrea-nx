import { Prisma, TipoDireccion } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateDireccionDto implements Prisma.DireccionCreateInput {
    @IsNotEmpty({ message: 'Tipo de Dirección es requerido' })
    @IsEnum(TipoDireccion, { message: 'Tipo es inválido' })
    tipo: TipoDireccion;
    @IsNotEmpty({ message: 'Calle es requerida' })
    calle: string;
    @IsNotEmpty({ message: 'Número es requerido' })
    numero: string;
    @IsNotEmpty({ message: 'Colonia es requerida' })
    colonia: string;
    @IsNotEmpty({ message: 'Codigo Postal es requerido' })
    codigoPostal: Prisma.CodigoPostalCreateNestedOneWithoutDireccionInput;
    @IsNotEmpty({ message: 'Ciudad es requerida' })
    ciudad: Prisma.CiudadCreateNestedOneWithoutDireccionesInput;
    @IsNotEmpty({ message: 'Estado es requerido' })
    estado: Prisma.EstadoCreateNestedOneWithoutDireccionesInput;
    cruzamientos?: string;
    sucursales?: Prisma.SucursalCreateNestedManyWithoutDireccionInput;
    cliente?: Prisma.ClienteCreateNestedOneWithoutDireccionesInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
