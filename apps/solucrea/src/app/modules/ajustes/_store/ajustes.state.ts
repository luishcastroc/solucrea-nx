import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Usuario, Sucursal } from '@prisma/client';
import { UpdateUsuario } from 'app/core/auth/store/auth.actions';
import { AuthState } from 'app/core/auth/store/auth.state';
import { tap } from 'rxjs/operators';

import { AjustesUsuarioService, AjustesSucursalService } from '../_services/';
import {
    AddUsuario,
    AjustesModeUsuario,
    ClearAjustesState,
    DeleteUsuario,
    EditUsuario,
    GetAllUsuarios,
    SearchUsuario,
    SelectUsuario,
} from './ajustes-usuarios.actions';
import { GetAllSucursales } from './ajustes-sucursales.actions';
import { AjustesStateModel } from './ajustes.model';

@State<AjustesStateModel>({
    name: 'ajustes',
    defaults: {
        usuarios: [],
        sucursales: [],
        editMode: 'edit',
        selectedUsuario: [],
        searchResult: [],
    },
})
@Injectable()
export class AjustesState {
    constructor(
        private _ajustesUsuarioService: AjustesUsuarioService,
        private _ajustesSucursalesService: AjustesSucursalService,
        private _store: Store
    ) {}

    @Selector()
    static searchResults({ searchResult }: AjustesStateModel): Usuario[] | Sucursal[] | [] {
        return searchResult;
    }

    @Selector()
    static editMode({ editMode }: AjustesStateModel): string {
        return editMode;
    }

    @Selector()
    static selectedUsuario({ selectedUsuario }: AjustesStateModel): Usuario | [] {
        return selectedUsuario;
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
    toggleEditMode(ctx: StateContext<AjustesStateModel>, action: AjustesModeUsuario) {
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
    getAllSucursales(ctx: StateContext<AjustesStateModel>, action: GetAllSucursales) {
        const { id } = action;
        return this._ajustesSucursalesService.getSucursales().pipe(
            tap((sucursales: Sucursal[]) => {
                ctx.patchState({
                    sucursales,
                    searchResult: sucursales,
                });
            })
        );
    }

    @Action(ClearAjustesState)
    clearState(ctx: StateContext<AjustesStateModel>) {
        ctx.patchState({
            usuarios: [],
            sucursales: [],
            editMode: 'edit',
            selectedUsuario: null,
            searchResult: [],
        });
    }
}
