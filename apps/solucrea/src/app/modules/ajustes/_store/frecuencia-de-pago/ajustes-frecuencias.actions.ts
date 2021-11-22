import { Prisma } from '@prisma/client';
import { EditMode } from 'app/core/models';

export class AddFrecuencias {
    static readonly type = '[Frecuencias] Add';
    constructor(public payload: Prisma.FrecuenciaDePagoCreateInput) {}
}

export class GetAllFrecuenciass {
    static readonly type = '[Frecuencias] Get All';
}

export class EditFrecuencias {
    static readonly type = '[Frecuencias] Edit';
    constructor(public id: string, public payload: Prisma.FrecuenciaDePagoUpdateInput) {}
}

export class DeleteFrecuencias {
    static readonly type = '[Frecuencias] Delete';
    constructor(public id: string) {}
}

export class SelectFrecuencias {
    static readonly type = '[Frecuencias] Select';
    constructor(public id: string) {}
}

export class AjustesModeFrecuencias {
    static readonly type = '[Frecuencias] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class ClearFrecuenciasState {
    static readonly type = '[Frecuencias] Clear Frecuencias State';
}

export class ClearFrecuencias {
    static readonly type = '[Frecuencias] Clear Frecuencias';
}
