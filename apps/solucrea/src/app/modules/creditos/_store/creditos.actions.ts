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

export class GetCreditosConfiguration {
    static readonly type = '[Creditos] Get Creditos Config';
}

export class ClearCreditosState {
    static readonly type = '[Creditos] Clear State';
}

export class ClearCreditosDetails {
    static readonly type = '[Creditos] Clear Details State';
}

export class GetClienteData {
    static readonly type = '[Creditos] Get Cliente Data';
    constructor(public id: string) {}
}
