import { Usuario } from '@prisma/client';
export type EditMode = 'new' | 'edit' | 'password';

export interface AjustesStateModel {
    usuarios: Usuario[] | null;
    editMode: 'new' | 'edit' | 'password';
    selectedUsuario: Usuario | null;
    searchResult: Usuario[] | null;
}
