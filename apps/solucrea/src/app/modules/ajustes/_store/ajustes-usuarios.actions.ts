import { Usuario } from '@prisma/client';
import { CreateUsuarioDto, UpdateUsuarioDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export class AddUsuario {
    static readonly type = '[Usuario] Add';
    constructor(public payload: CreateUsuarioDto) {}
}

export class GetAllUsuarios {
    static readonly type = '[Usuario] Get All';
    constructor(public id: string) {}
}

export class EditUsuario {
    static readonly type = '[Usuario] Edit';
    constructor(public id: string, public payload: UpdateUsuarioDto) {}
}

export class DeleteUsuario {
    static readonly type = '[Usuario] Delete';
    constructor(public id: string) {}
}

export class SelectUsuario {
    static readonly type = '[Usuario] Select';
    constructor(public usuario: Usuario) {}
}

export class AjustesModeUsuario {
    static readonly type = '[Usuario] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class SearchUsuario {
    static readonly type = '[Usuario] Search';
    constructor(public payload: string) {}
}

export class ClearUsuarioState {
    static readonly type = '[Usuario] Clear Usuario State';
}

export class ClearAjustesState {
    static readonly type = '[Ajustes] Clear State';
}
