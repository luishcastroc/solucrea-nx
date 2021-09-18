import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos';
import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';
import { UpdateUsuario } from 'app/core/auth/store/auth.actions';
import { AuthState } from 'app/core/auth/store/auth.state';
import { EditMode } from 'app/core/models/edit-mode.type';
import { ClientesService } from 'app/modules/clientes';
import { tap } from 'rxjs/operators';

import { AjustesSucursalService, AjustesUsuarioService } from '../_services/';
import {
    AddSucursal,
    AjustesModeSucursal,
    ClearSucursalState,
    DeleteSucursal,
    EditSucursal,
    GetAllSucursales,
    GetColonias,
    SelectSucursal,
} from './ajustes-sucursales.actions';
import {
    AddUsuario,
    AjustesModeUsuario,
    ClearAjustesState,
    ClearUsuarioState,
    DeleteUsuario,
    EditUsuario,
    GetAllUsuarios,
    SearchUsuario,
    SelectUsuario,
} from './ajustes-usuarios.actions';
import { AjustesStateModel } from './ajustes.model';

@State<AjustesStateModel>({
    name: 'ajustes',
    defaults: {
        usuarios: [],
        sucursales: [],
        editMode: 'edit',
        selectedUsuario: undefined,
        selectedSucursal: undefined,
        searchResult: [],
        loading: false,
        colonias: undefined,
    },
})
@Injectable()
export class AjustesState {
    constructor(
        private _ajustesUsuarioService: AjustesUsuarioService,
        private _ajustesSucursalesService: AjustesSucursalService,
        private _clientesService: ClientesService,
        private _store: Store
    ) {}

    @Selector()
    static searchResults({ searchResult }: AjustesStateModel): Usuario[] | ISucursalReturnDto[] | [] {
        return searchResult;
    }

    @Selector()
    static editMode({ editMode }: AjustesStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static selectedUsuario({ selectedUsuario }: AjustesStateModel): Usuario | undefined {
        return selectedUsuario;
    }

    @Selector()
    static selectedSucursal({ selectedSucursal }: AjustesStateModel): ISucursalReturnDto | undefined {
        return selectedSucursal;
    }

    @Selector()
    static loading({ loading }: AjustesStateModel): boolean {
        return loading;
    }

    @Selector()
    static sucursales({ sucursales }: AjustesStateModel): ISucursalReturnDto[] {
        return sucursales;
    }

    @Selector()
    static colonias({ colonias }: AjustesStateModel): IColoniaReturnDto | [] {
        return colonias;
    }

    @Action(GetAllUsuarios)
    getAllUsuarios(ctx: StateContext<AjustesStateModel>, action: GetAllUsuarios) {
        const { id } = action;
        return this._ajustesUsuarioService.getUsuarios().pipe(
            tap((result: Usuario[]) => {
                const usuarios = result.filter((user) => user.id !== id);
                ctx.patchState({
                    usuarios,
                    searchResult: usuarios,
                });
            })
        );
    }

    @Action(AddUsuario)
    addUsuario(ctx: StateContext<AjustesStateModel>, action: AddUsuario) {
        const { payload } = action;
        return this._ajustesUsuarioService.addUsuario(payload).pipe(
            tap((user: Usuario) => {
                const state = ctx.getState();
                const usuarios = [...state.usuarios];
                usuarios.push(user);

                ctx.patchState({ usuarios });
            })
        );
    }

    @Action(EditUsuario)
    editUsuario(ctx: StateContext<AjustesStateModel>, action: EditUsuario) {
        const { id, payload } = action;
        const authenticatedUser = this._store.selectSnapshot(AuthState.user);
        return this._ajustesUsuarioService.editUsuario(id, payload).pipe(
            tap((user: Usuario) => {
                const state = ctx.getState();
                if (state.usuarios) {
                    const usuarios = [...state.usuarios];
                    const usuarioIdx = usuarios.findIndex((usuario) => usuario.id === id);
                    usuarios[usuarioIdx] = user;

                    ctx.patchState({
                        usuarios,
                    });
                }
                if (authenticatedUser.id === user.id) {
                    ctx.dispatch(new UpdateUsuario(user));
                }
            })
        );
    }

    @Action(DeleteUsuario)
    deleteUsuario(ctx: StateContext<AjustesStateModel>, action: DeleteUsuario) {
        const { id } = action;
        return this._ajustesUsuarioService.deleteUsuario(id).pipe(
            tap((user: Usuario) => {
                const state = ctx.getState();
                if (state.usuarios) {
                    const usuarios = [...state.usuarios];
                    const usuarioIdx = usuarios.findIndex((usuario) => usuario.id === id);
                    usuarios[usuarioIdx] = user;
                    if (usuarioIdx !== -1) {
                        usuarios.splice(usuarioIdx, 1);
                        ctx.patchState({
                            usuarios,
                        });
                    }
                }
            })
        );
    }

    @Action(SelectUsuario)
    selectUsuario(ctx: StateContext<AjustesStateModel>, action: SelectUsuario) {
        const { usuario: selectedUsuario } = action;
        ctx.patchState({ selectedUsuario });
    }

    @Action(AjustesModeUsuario)
    toggleEditModeUsuario(ctx: StateContext<AjustesStateModel>, action: AjustesModeUsuario) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(AjustesModeSucursal)
    toggleEditModeSucursal(ctx: StateContext<AjustesStateModel>, action: AjustesModeSucursal) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(SearchUsuario)
    searchUsuario(ctx: StateContext<AjustesStateModel>, action: SearchUsuario) {
        const { payload } = action;
        const state = ctx.getState();
        const usuarios = [...state.usuarios];
        const searchResult = usuarios.filter(
            (usuario) => usuario.nombre && usuario.nombre.toLowerCase().includes(payload.toLowerCase())
        );
        ctx.patchState({ searchResult });
    }

    @Action(GetAllSucursales)
    getAllSucursales(ctx: StateContext<AjustesStateModel>) {
        return this._ajustesSucursalesService.getSucursales().pipe(
            tap((sucursales: ISucursalReturnDto[]) => {
                ctx.patchState({
                    sucursales,
                    searchResult: sucursales,
                });
            })
        );
    }

    @Action(AddSucursal)
    addSucursal(ctx: StateContext<AjustesStateModel>, action: AddSucursal) {
        const { payload } = action;
        return this._ajustesSucursalesService.addSucursal(payload).pipe(
            tap((sucursal: ISucursalReturnDto) => {
                const state = ctx.getState();
                const sucursales = [...state.sucursales];
                sucursales.push(sucursal);

                ctx.patchState({ sucursales });
            })
        );
    }

    @Action(EditSucursal)
    editSucursal(ctx: StateContext<AjustesStateModel>, action: EditUsuario) {
        const { id, payload } = action;
        return this._ajustesSucursalesService.editSucursal(id, payload).pipe(
            tap((sucursal: ISucursalReturnDto) => {
                const state = ctx.getState();
                if (state.sucursales) {
                    const sucursales = [...state.sucursales];
                    const idx = sucursales.findIndex((suc) => suc.id === id);
                    sucursales[idx] = sucursal;

                    ctx.patchState({
                        sucursales,
                    });
                }
            })
        );
    }

    @Action(SelectSucursal)
    selectSucursal(ctx: StateContext<AjustesStateModel>, { id }: SelectSucursal) {
        return this._ajustesSucursalesService.getSucursal(id).pipe(
            tap((selectedSucursal) => {
                ctx.patchState({ selectedSucursal });
            })
        );
    }

    @Action(DeleteSucursal)
    deleteSucursal(ctx: StateContext<AjustesStateModel>, action: DeleteSucursal) {
        const { id } = action;
        return this._ajustesSucursalesService.deleteSucursal(id).pipe(
            tap((sucursal: ISucursalReturnDto) => {
                const state = ctx.getState();
                if (sucursal) {
                    const sucursales = [...state.sucursales];
                    const idx = sucursales.findIndex((suc) => suc.id === id);
                    sucursales.splice(idx, 1);
                    ctx.patchState({
                        sucursales,
                    });
                }
            })
        );
    }

    @Action(GetColonias)
    getColonias(ctx: StateContext<AjustesStateModel>, { cp }: GetColonias) {
        return this._clientesService.getColoniasByCp(cp).pipe(
            tap((colonias: IColoniaReturnDto) => {
                const state = ctx.getState();
                ctx.patchState({
                    colonias,
                });
            })
        );
    }

    @Action(ClearSucursalState)
    clearSucursalState(ctx: StateContext<AjustesStateModel>) {
        ctx.patchState({
            editMode: 'edit',
            selectedSucursal: undefined,
            searchResult: [],
            loading: false,
            colonias: undefined,
        });
    }

    @Action(ClearUsuarioState)
    clearUsuarioState(ctx: StateContext<AjustesStateModel>) {
        ctx.patchState({
            editMode: 'edit',
            selectedUsuario: undefined,
            searchResult: [],
            loading: false,
            colonias: undefined,
        });
    }

    @Action(ClearAjustesState)
    clearState(ctx: StateContext<AjustesStateModel>) {
        ctx.patchState({
            usuarios: [],
            sucursales: [],
            editMode: 'edit',
            selectedUsuario: undefined,
            selectedSucursal: undefined,
            searchResult: [],
            loading: false,
            colonias: undefined,
        });
    }
}
