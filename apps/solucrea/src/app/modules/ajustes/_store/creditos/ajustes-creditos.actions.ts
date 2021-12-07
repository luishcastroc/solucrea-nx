import { EditMode } from 'app/core/models';

import { Producto } from '.prisma/client';

export class AddCredito {
    static readonly type = '[Credito] Add';
    constructor(public payload: Producto) {}
}

export class GetAllCreditos {
    static readonly type = '[Credito] Get All';
}

export class EditCredito {
    static readonly type = '[Credito] Edit';
    constructor(public id: string, public payload: any) {}
}

export class DeleteCredito {
    static readonly type = '[Credito] Delete';
    constructor(public id: string) {}
}

export class SelectCredito {
    static readonly type = '[Credito] Select';
    constructor(public id: string) {}
}

export class AjustesModeCredito {
    static readonly type = '[Credito] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class ClearCreditoState {
    static readonly type = '[Credito] Clear Credito State';
}

export class ClearCreditos {
    static readonly type = '[Credito] Clear Creditos';
}

export class ChangeSearchFilterCreditos {
    static readonly type = '[Credito] Change Filter';
    constructor(public payload: boolean) {}
}
