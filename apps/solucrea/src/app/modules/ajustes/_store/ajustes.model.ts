import { Usuario, Sucursal } from '@prisma/client';
import { EditMode } from 'app/core/models/edit-mode.type';

export interface AjustesStateModel {
    usuarios: Usuario[] | [];
    sucursales: Sucursal[] | [];
    editMode: EditMode;
    selectedUsuario: Usuario | [];
    searchResult: Usuario[] | Sucursal[] | [];
}
