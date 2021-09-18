import { IColoniaReturnDto } from 'api/dtos';
import { Usuario } from '@prisma/client';
import { EditMode } from 'app/core/models/edit-mode.type';
import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';

export interface AjustesStateModel {
    usuarios: Usuario[] | [];
    sucursales: ISucursalReturnDto[] | [];
    editMode: EditMode;
    selectedUsuario: Usuario | undefined;
    selectedSucursal: ISucursalReturnDto | undefined;
    searchResult: Usuario[] | ISucursalReturnDto[] | [];
    loading: boolean;
    colonias: IColoniaReturnDto;
}
