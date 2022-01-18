import { Decimal } from '@prisma/client/runtime';
import { Colocador } from '@prisma/client';
import { IAvalReturnDto, ISucursalReturnDto } from 'api/dtos';

import { ModalidadDeSeguro, Pago, Producto, Seguro, Status } from '.prisma/client';

export interface ICreditoReturnDto {
    id: string;
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
}
