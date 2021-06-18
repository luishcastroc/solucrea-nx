import { Prisma } from '@prisma/client';
import { UpdateUsuarioDto } from '../models/update-usuario.dto';

export class Add {
    static readonly type = '[Usuario] Add';
    constructor(public payload: Prisma.UsuarioCreateInput) {}
}

export class GetAll {
    static readonly type = '[Usuario] Get All';
    constructor(public id: string) {}
}

export class Edit {
    static readonly type = '[Usuario] Edit';
    constructor(public id: string, public payload: UpdateUsuarioDto) {}
}

export class Delete {
    static readonly type = '[Usuario] Delete';
    constructor(public id: string) {}
}
