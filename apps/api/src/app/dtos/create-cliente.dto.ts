import { Prisma } from '@prisma/client';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateClienteDto implements Prisma.ClienteCreateInput {
    @IsNotEmpty({ message: 'Nombre es requerido' })
    nombre: string;
    @IsNotEmpty({ message: 'Apellido es requerido' })
    apellidos: string;
    @IsNotEmpty({ message: 'Fecha de nacimiento es requerida' })
    @IsDate({ message: 'Fecha inválida favor de verificar' })
    fechaDeNacimiento: string | Date;
    @IsNotEmpty({ message: 'RFC es requerido' })
    rfc: string;
    @IsNotEmpty({ message: 'CURP es requerido' })
    curp: string;
    @IsNotEmpty({ message: 'Monto mínimo es requerido' })
    montoMinimo: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Monto máximo es requerido' })
    montoMaximo: string | number | Prisma.Decimal;
    @IsNotEmpty({ message: 'Estado civil es requerido' })
    estadoCivil: Prisma.EstadoCivilCreateNestedOneWithoutClientesInput;
    @IsNotEmpty({ message: 'Típo de vivienda es requerido' })
    tipoDeVivienda: Prisma.TipoDeViviendaCreateNestedOneWithoutClientesInput;
    @IsNotEmpty({ message: 'Escolaridad es requerida' })
    escolaridad: Prisma.EscolaridadCreateNestedOneWithoutClientesInput;
    @IsNotEmpty({ message: 'Género es requerido' })
    genero: Prisma.GeneroCreateNestedOneWithoutClientesInput;
    @IsNotEmpty({ message: 'Teléfono es requerido' })
    telefono1: string;
    telefono2?: string;
    numeroCreditosCrecer?: number;
    creadoPor: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    direcciones?: Prisma.DireccionCreateNestedManyWithoutClienteInput;
    creditos?: Prisma.CreditoCreateNestedManyWithoutClienteInput;
}
