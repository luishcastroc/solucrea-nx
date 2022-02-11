import { Aval, Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateCreditoDto {
    @IsNotEmpty({ message: 'La fecha de inicio es requerida.' })
    fechaInicio?: string | Date;
    @IsNotEmpty({ message: 'El monto es requerido.' })
    monto!: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'El cliente es requerido.' })
    clienteId!: string;
    @IsNotEmpty({ message: 'La Sucursal es requerida.' })
    sucursalId!: string;
    @IsNotEmpty({ message: 'El producto es requerido.' })
    productosId!: string;
    @IsNotEmpty({ message: 'El aval es requerido.' })
    aval!: Partial<Aval> | Aval;
    @IsNotEmpty({ message: 'La modalidad de seguro es requerida.' })
    modalidadDeSeguroId!: string;
    creadoPor!: string;
    segurosId?: string;
}
