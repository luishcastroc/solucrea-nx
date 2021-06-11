import { Prisma } from '@prisma/client';

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
    constructor(public id: string, public payload: Prisma.UsuarioUpdateInput) {}
}

export class Delete {
    static readonly type = '[Usuario] Delete';
    constructor(public id: string) {}
}
