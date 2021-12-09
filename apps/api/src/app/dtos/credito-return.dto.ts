import { Decimal } from '@prisma/client/runtime';
import { IClienteReturnDto, ISucursalReturnDto } from 'api/dtos';

import { IAvalReturnDto } from './aval-return.dto';
import { Estado, ModalidadDeSeguro, Pago, Producto, Seguro, Status } from '.prisma/client';

export interface ICreditoReturnDto {
    id: string;
    fechaInicio: Date | string;
    fechaFinal: Date | string;
    fechaLiquidacion: Date | string;
    monto: Decimal | number | string;
    status: Status;
    creadoPor: string;
    fechaCreacion: Date | string;
    actualizadoPor: string;
    fechaActualizacion: Date | string;
    cliente: IClienteReturnDto;
    sucursal: ISucursalReturnDto;
    estado: Estado;
    producto: Producto;
    seguro: Seguro;
    modalidadDeSeguro: ModalidadDeSeguro;
    aval: IAvalReturnDto;
    pagos: Pago[];
}
