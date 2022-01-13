import { Decimal } from '@prisma/client/runtime';
import { IAvalReturnDto, IClienteReturnDto, ISucursalReturnDto, IUsuarioReturnDto } from 'api/dtos';

import { ModalidadDeSeguro, Pago, Producto, Seguro, Status } from '.prisma/client';

export interface ICreditoReturnDto {
    id: string;
    fechaDesembolso: Date | string;
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
    observaciones: string;
    colocador: Partial<IUsuarioReturnDto> | Partial<IClienteReturnDto>;
    modalidadDeSeguro: Partial<ModalidadDeSeguro>;
    aval: Partial<IAvalReturnDto>;
    pagos: Partial<Pago>[];
}
