import {
    IClienteReturnDto,
    ICreditoReturnDto,
    IParentescoReturnDto,
    ISeguroReturnDto,
    ISucursalReturnDto,
    IUsuarioReturnDto,
    IModalidadSeguroReturnDto,
} from 'api/dtos';
import { EditMode } from 'app/core/models';

import { ISegurosData } from '../_models';
import { Producto } from '.prisma/client';

export interface CreditosStateModel {
    editMode: EditMode;
    loading: boolean;
    creditos: ICreditoReturnDto[] | [];
    creditosFiltered: ICreditoReturnDto[] | [];
    clienteCreditos: ICreditoReturnDto[] | [];
    clienteCreditosFiltered: ICreditoReturnDto[] | [];
    productos: Producto[] | [];
    sucursales: ISucursalReturnDto[] | [];
    clientes: IClienteReturnDto[] | [];
    colocadores: IUsuarioReturnDto[] | [];
    parentescos: IParentescoReturnDto[] | [];
    segurosData: ISegurosData | undefined;
    selectedOtro: boolean;
    clientesCount: number;
    turnosCount: number;
    selectedClienteReferral: IClienteReturnDto | undefined;
    selectedCredito: ICreditoReturnDto | undefined;
    selectedClienteCredito: ICreditoReturnDto | undefined;
    selectedModalidadDeSeguro: IModalidadSeguroReturnDto | undefined;
    selectedCliente: IClienteReturnDto | undefined;
    selectedProducto: Producto | undefined;
    selectedSeguro: ISeguroReturnDto | undefined;
}
