import { Credito, Direccion, Prisma, TipoDireccion } from '@prisma/client';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class IDireccion {
    id?: string;
    tipo: TipoDireccion;
    calle: string;
    numero: string;
    cruzamientos: string | null;
    creadoPor?: string;
    fechaCreacion?: Date;
    actualizadoPor?: string;
    fechaActualizacion?: Date;
    clienteId?: string | null;
    coloniaId: string;
}

export class ITrabajo {
    @IsNotEmpty({ message: 'Nombre del trabajo es requerido' })
    nombre: string;
    @IsNotEmpty({ message: 'Teléfono del trabajo es requerido' })
    telefono: string;
    @IsNotEmpty({ message: 'Antiguedad en el trabajo es requerida' })
    antiguedad: number;
    @IsNotEmpty({ message: 'Dirección del trabajo es requerido' })
    direccion: IDireccion;
    @IsNotEmpty({ message: 'Actividad económica del trabajo es requerida' })
    actividadEconomica: string;
    id?: string;
    creadoPor?: string;
    fechaCreacion?: Date;
    actualizadoPor?: string;
    fechaActualizacion?: Date;
}

export class CreateClienteDto {
    @IsNotEmpty({ message: 'Nombre es requerido' })
    nombre: string;
    @IsNotEmpty({ message: 'Apellido paterno es requerido' })
    apellidoPaterno: string;
    @IsNotEmpty({ message: 'Apellido materno es requerido' })
    apellidoMaterno: string;
    @IsNotEmpty({ message: 'Fecha de nacimiento es requerida' })
    @IsDateString({ strict: true }, { message: 'Fecha inválida favor de verificar' })
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
    @IsNotEmpty({ message: 'Trabajo es requerido' })
    trabajo: ITrabajo;
    telefono2?: string;
    numeroCreditosCrecer?: number;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    direcciones?: IDireccion[];
    creditos?: Credito[];
}
