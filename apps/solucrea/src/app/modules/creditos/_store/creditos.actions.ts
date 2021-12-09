import { EditMode } from 'app/core/models';

export class GetAllCreditosCliente {
    static readonly type = '[Creditos Cliente] Get All';
    constructor(public id: string) {}
}

export class ModeCredito {
    static readonly type = '[Creditos] Edit Mode';
    constructor(public payload: EditMode) {}
}
