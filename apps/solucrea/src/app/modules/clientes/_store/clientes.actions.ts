import { CreateClienteDto, UpdateClienteDto } from 'api/dtos';
import { Cliente, TipoDireccion } from '@prisma/client';
import { EditMode } from 'app/core/models/edit-mode.type';

export class Add {
    static readonly type = '[Cliente] Add';
    constructor(public payload: CreateClienteDto) {}
}

export class GetAll {
    static readonly type = '[Cliente] Get All';
    constructor(public id: string) {}
}

export class Edit {
    static readonly type = '[Cliente] Edit';
    constructor(public id: string, public payload: UpdateClienteDto) {}
}

export class Delete {
    static readonly type = '[Cliente] Delete';
    constructor(public id: string) {}
}

export class Select {
    static readonly type = '[Cliente] Select';
    constructor(public usuario: Cliente) {}
}

export class ClientesMode {
    static readonly type = '[Cliente] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class Search {
    static readonly type = '[Cliente] Search';
    constructor(public payload: string) {}
}

export class GetColonias {
    static readonly type = '[Cliente] Get Colonias';
    constructor(public cp: string, public index: number, public tipo: TipoDireccion) {}
}

export class RemoveColonia {
    static readonly type = '[Cliente] Remove Colonia';
    constructor(public index: number) {}
}

export class GetConfig {
    static readonly type = '[Cliente] Get Config';
}

export class ClearClientesState {
    static readonly type = '[Clientes] Clear State';
}
