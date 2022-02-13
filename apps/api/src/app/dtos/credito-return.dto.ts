import { Colocador, ModalidadDeSeguro, Pago, Producto, Seguro, Status } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { IAvalReturnDto, ISucursalReturnDto } from 'api/dtos';

import { IClienteReturnDto } from './cliente-return.dto';

export enum StatusPago {
    pagado = 'PAGADO',
    adeuda = 'ADEUDA',
    corriente = 'CORRIENTE',
}

export interface ICreditoReturnDto {
    id: string;
    cliente: IClienteReturnDto;
    fechaDesembolso: Date | string;
    fechaInicio: Date | string;
    fechaFinal: Date | string;
    fechaLiquidacion: Date | string;
    monto: Decimal | number | string;
    status: Status;
    sucursal: Partial<ISucursalReturnDto>;
    producto: Partial<Producto>;
    seguro: Partial<Seguro>;
    observaciones: string;
    colocador: Partial<Colocador>;
    modalidadDeSeguro: Partial<ModalidadDeSeguro>;
    aval: Partial<IAvalReturnDto>;
    pagos: Partial<Pago>[];
    cuota: Decimal | number | string;
    cuotaCapital: Decimal | number | string;
    cuotaInteres: Decimal | number | string;
    cuotaSeguro: Decimal | number | string;
    saldo?: Decimal | number | string;
    amortizacion?: IAmortizacion[];
}

export interface ICreditoClienteReturnDto {
    cliente: IClienteReturnDto;
    creditos: Partial<ICreditoReturnDto>[];
}

export interface IAmortizacion {
    numeroDePago: number;
    fechaDePago: Date | string;
    status: StatusPago;
}
