import { Usuario } from '@prisma/client';
import { CreateUsuarioDto, UpdateUsuarioDto } from 'api/dtos';
import { EditMode } from 'app/core/models/edit-mode.type';

export class Add {
    static readonly type = '[Usuario] Add';
    constructor(public payload: CreateUsuarioDto) {}
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

export class Select {
    static readonly type = '[Usuario] Select';
    constructor(public usuario: Usuario) {}
}

export class AjustesMode {
    static readonly type = '[Ajustes] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class Search {
    static readonly type = '[Usuario] Search';
    constructor(public payload: string) {}
}

export class ClearAjustesState {
    static readonly type = '[Ajustes] Clear State';
}
