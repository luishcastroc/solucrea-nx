import { ICajaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export interface CajaStateModel {
    cajas: ICajaReturnDto[] | [];
    selectedCaja: ICajaReturnDto;
    editMode: EditMode;
    loading: boolean;
}
