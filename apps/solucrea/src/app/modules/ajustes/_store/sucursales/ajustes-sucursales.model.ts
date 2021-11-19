import { IColoniaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export interface AjustesSucursalesStateModel {
    sucursales: ISucursalReturnDto[] | [];
    editMode: EditMode;
    selectedSucursal: ISucursalReturnDto | undefined;
    loading: boolean;
    colonias: IColoniaReturnDto;
}
