import { CreateSucursalDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export class AddSucursal {
    static readonly type = '[Sucursal] Add';
    constructor(public payload: CreateSucursalDto) {}
}

export class GetAllSucursales {
    static readonly type = '[Sucursal] Get All';
}

export class EditSucursal {
    static readonly type = '[Sucursal] Edit';
    constructor(public id: string, public payload: any) {}
}

export class DeleteSucursal {
    static readonly type = '[Sucursal] Delete';
    constructor(public id: string) {}
}

export class SelectSucursal {
    static readonly type = '[Sucursal] Select';
    constructor(public id: string) {}
}

export class AjustesModeSucursal {
    static readonly type = '[Sucursal] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class GetColonias {
    static readonly type = '[Sucursal] Get Colonias';
    constructor(public cp: string) {}
}

export class SearchSucursal {
    static readonly type = '[Sucursal] Search';
    constructor(public payload: string) {}
}

export class ClearSucursalState {
    static readonly type = '[Sucursal] Clear Sucursal State';
}
