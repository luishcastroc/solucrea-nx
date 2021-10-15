import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';
import { ICajaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export interface CajaStateModel {
    cajas: ICajaReturnDto[] | [];
    sucursales: ISucursalReturnDto[] | [];
    selectedCaja: ICajaReturnDto;
    editMode: EditMode;
    loading: boolean;
}
