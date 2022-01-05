import { IModalidadSeguroReturnDto } from './../../../../../../api/src/app/dtos/modalidad-seguro-return.dto';
import {
    IClienteReturnDto,
    ICreditoReturnDto,
    IParentescoReturnDto,
    ISeguroReturnDto,
    ISucursalReturnDto,
    IUsuarioReturnDto,
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
}
