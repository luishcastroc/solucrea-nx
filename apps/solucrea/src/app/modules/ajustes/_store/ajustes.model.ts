import { Usuario } from '@prisma/client';
import { IColoniaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export interface AjustesStateModel {
    usuarios: Usuario[] | [];
    sucursales: ISucursalReturnDto[] | [];
    editMode: EditMode;
    selectedUsuario: Usuario | undefined;
    selectedSucursal: ISucursalReturnDto | undefined;
    loading: boolean;
    colonias: IColoniaReturnDto;
}
