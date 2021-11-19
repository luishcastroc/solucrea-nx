import { Usuario } from '@prisma/client';
import { EditMode } from 'app/core/models';

export interface AjustesUsuariosStateModel {
    usuarios: Usuario[] | [];
    editMode: EditMode;
    selectedUsuario: Usuario | undefined;
    loading: boolean;
}
