import { Producto } from '.prisma/client';
import {
    ICreditoReturnDto,
    IClienteReturnDto,
    ISucursalReturnDto,
    IUsuarioReturnDto,
    IParentescoReturnDto,
} from 'api/dtos';
import { EditMode } from 'app/core/models';

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
    colocadores: IUsuarioReturnDto[] | [];
    parentescos: IParentescoReturnDto[] | [];
    selectedOtro: boolean;
}
