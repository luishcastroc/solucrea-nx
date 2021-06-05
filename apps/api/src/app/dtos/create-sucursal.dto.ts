import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateSucursalDto implements Prisma.SucursalCreateInput {
    @IsNotEmpty({ message: 'Nombre es requerido.' })
    nombre: string;
    @IsNotEmpty({ message: 'Teléfono es requerido.' })
    telefono: string;
    @IsNotEmpty({ message: 'Dirección es requerida.' })
    direccion: Prisma.DireccionCreateNestedOneWithoutSucursalesInput;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    comisionistas?: Prisma.ComisionistaCreateNestedManyWithoutSucursalInput;
    creditos?: Prisma.CreditoCreateNestedManyWithoutSucursalInput;
    comisiones?: Prisma.ComisionCreateNestedManyWithoutSucursalInput;
    cajas?: Prisma.CajaCreateNestedManyWithoutSucursalInput;
}
