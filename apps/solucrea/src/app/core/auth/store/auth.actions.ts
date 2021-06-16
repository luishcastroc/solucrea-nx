import { Usuario } from '@prisma/client';
export class Login {
    static readonly type = '[Auth] Login';
    constructor(
        public payload: {
            username: string;
            password: string;
            redirectURL: string;
        }
    ) {}
}

export class Logout {
    static readonly type = '[Auth] Logout';
}

export class UpdateUsuario {
    static readonly type = '[Auth] Update Usuario';
    constructor(public payload: Usuario) {}
}
