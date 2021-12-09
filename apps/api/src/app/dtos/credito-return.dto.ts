import { Decimal } from '@prisma/client/runtime';
import { IClienteReturnDto, ISucursalReturnDto } from 'api/dtos';

import { IAvalReturnDto } from './aval-return.dto';
import { ModalidadDeSeguro, Pago, Producto, Seguro, Status } from '.prisma/client';

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
    sucursal: Partial<ISucursalReturnDto>;
    producto: Partial<Producto>;
    seguro: Partial<Seguro>;
    modalidadDeSeguro: Partial<ModalidadDeSeguro>;
    aval: Partial<IAvalReturnDto>;
    pagos: Partial<Pago>[];
}
