import { IDireccion } from 'api/dtos';
import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateSucursalDto {
    @IsNotEmpty({ message: 'Nombre es requerido.' })
    nombre: string;
    @IsNotEmpty({ message: 'Teléfono es requerido.' })
    telefono: string;
    @IsNotEmpty({ message: 'Dirección es requerida.' })
    direccion: IDireccion;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    creditos?: Prisma.CreditoCreateNestedManyWithoutSucursalInput;
    comisiones?: Prisma.ComisionCreateNestedManyWithoutSucursalInput;
    cajas?: Prisma.CajaCreateNestedManyWithoutSucursalInput;
}
