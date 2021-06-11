import { Usuario } from '@prisma/client';
export interface AuthStateModel {
    accessToken: string | null;
    user: Usuario | null;
}
