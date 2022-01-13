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
    creditos: ICreditoReturnDto[] | [];
    creditosFiltered: ICreditoReturnDto[] | [];
    clienteCreditos: ICreditoReturnDto[] | [];
    clienteCreditosFiltered: ICreditoReturnDto[] | [];
    editMode: EditMode;
    selectedCredito: ICreditoReturnDto | undefined;
    selectedClienteCredito: ICreditoReturnDto | undefined;
    loading: boolean;
    productos: Producto[] | [];
    sucursales: ISucursalReturnDto[] | [];
    clientes: IClienteReturnDto[] | [];
    selectedCliente: IClienteReturnDto;
    selectedProducto: Producto;
    selectedModalidadDeSeguro: IModalidadSeguroReturnDto | undefined;
    selectedSeguro: ISeguroReturnDto | undefined;
    colocadores: IUsuarioReturnDto[] | [];
    parentescos: IParentescoReturnDto[] | [];
    selectedOtro: boolean;
    segurosData: ISegurosData;
    clientesCount: number;
    turnosCount: number;
    selectedClienteReferral: IClienteReturnDto | undefined;
}
