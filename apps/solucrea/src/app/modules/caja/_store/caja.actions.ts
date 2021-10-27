import { Prisma, Caja } from '@prisma/client';
import { CreateCajaDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export class Add {
    static readonly type = '[Caja] Add';
    constructor(public payload: CreateCajaDto) {}
}

export class GetAll {
    static readonly type = '[Caja] Get All';
}

export class GetOne {
    static readonly type = '[Caja] Get One';
    constructor(public id: string) {}
}

export class Edit {
    static readonly type = '[Caja] Edit';
    constructor(public id: string, public payload: Prisma.CajaUncheckedUpdateInput) {}
}

export class Delete {
    static readonly type = '[Caja] Delete';
    constructor(public id: string) {}
}

export class SelectCaja {
    static readonly type = '[Caja] Select';
    constructor(public id: string) {}
}

export class CajasMode {
    static readonly type = '[Caja] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class ClearCajasState {
    static readonly type = '[Caja] Clear State';
}

export class GetAllSucursales {
    static readonly type = '[Caja] Get All Sucursales';
}
