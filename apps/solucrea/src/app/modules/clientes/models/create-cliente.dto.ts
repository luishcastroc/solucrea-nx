import { Prisma } from '@prisma/client';
export class CreateClienteDto implements Prisma.ClienteCreateInput {
    id?: string;
    nombre: string;
    apellidos: string;
    fechaDeNacimiento: string | Date;
    rfc: string;
    curp: string;
    telefono1: string;
    telefono2?: string;
    montoMinimo: string | number | Prisma.Decimal;
    montoMaximo: string | number | Prisma.Decimal;
    numeroCreditosCrecer?: number;
    creadoPor: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
    estadoCivil: Prisma.EstadoCivilCreateNestedOneWithoutClientesInput;
    tipoDeVivienda: Prisma.TipoDeViviendaCreateNestedOneWithoutClientesInput;
    escolaridad: Prisma.EscolaridadCreateNestedOneWithoutClientesInput;
    genero: Prisma.GeneroCreateNestedOneWithoutClientesInput;
    direcciones?: Prisma.DireccionCreateNestedManyWithoutClienteInput;
    creditos?: Prisma.CreditoCreateNestedManyWithoutClienteInput;
    pagos?: Prisma.PagoCreateNestedManyWithoutClienteInput;
}
