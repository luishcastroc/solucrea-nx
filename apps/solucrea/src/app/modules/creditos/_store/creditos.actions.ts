import { Status } from '@prisma/client';
import { EditMode } from 'app/core/models';

export class GetAllCreditos {
    static readonly type = '[Creditos] Get All';
}

export class GetAllCreditosCliente {
    static readonly type = '[Creditos Cliente] Get All';
    constructor(public id: string) {}
}

export class ModeCredito {
    static readonly type = '[Creditos] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class ChangeSearchFilter {
    static readonly type = '[Creditos] Change Filter';
    constructor(public payload: Status) {}
}
