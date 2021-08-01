import { Usuario } from '@prisma/client';
import { EditMode } from 'app/core/models/edit-mode.type';

export interface AjustesStateModel {
    usuarios: Usuario[] | null;
    editMode: EditMode;
    selectedUsuario: Usuario | null;
    searchResult: Usuario[] | null;
}
