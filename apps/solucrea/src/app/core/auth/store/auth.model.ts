import { Usuario } from '@prisma/client';
export interface AuthStateModel {
    accessToken: string;
    user: Usuario | undefined;
}
