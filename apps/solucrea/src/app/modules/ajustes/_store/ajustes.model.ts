import { Usuario } from '@prisma/client';
export interface AjustesStateModel {
    usuarios: Usuario[] | null;
}
