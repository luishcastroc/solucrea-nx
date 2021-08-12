import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { UpdateUsuario } from 'app/core/auth/store/auth.actions';
import { AuthState } from 'app/core/auth/store/auth.state';
import { tap } from 'rxjs/operators';

import { AjustesService } from './../ajustes.service';
import * as AjustesAction from './ajustes.actions';
import { AjustesStateModel } from './ajustes.model';

@State<AjustesStateModel>({
    name: 'ajustes',
    defaults: {
        usuarios: [],
        editMode: 'edit',
        selectedUsuario: null,
        searchResult: [],
    },
})
@Injectable()
export class AjustesState {
    constructor(
        private ajustesService: AjustesService,
        private _store: Store
    ) {}

    @Selector()
    static searchResults({
        searchResult,
    }: AjustesStateModel): Usuario[] | null {
        return searchResult;
    }

    @Selector()
    static editMode({ editMode }: AjustesStateModel): string {
        return editMode;
    }

    @Selector()
    static selectedUsuario({ selectedUsuario }: AjustesStateModel): Usuario {
        return selectedUsuario;
    }

    @Action(AjustesAction.GetAll)
    getAllUsuarios(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.GetAll
    ) {
        const { id } = action;
        return this.ajustesService.getUsuarios().pipe(
            tap((result: Usuario[]) => {
                const usuarios = result.filter((user) => user.id !== id);
                ctx.patchState({
                    usuarios,
                    searchResult: usuarios,
                });
            })
        );
    }

    @Action(AjustesAction.Add)
    addUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Add
    ) {
        const { payload } = action;
        return this.ajustesService.addUsuario(payload).pipe(
            tap((user: Usuario) => {
                const state = ctx.getState();
                const usuarios = [...state.usuarios];
                usuarios.push(user);

                ctx.patchState({ usuarios });
            })
        );
    }

    @Action(AjustesAction.Edit)
    editUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Edit
    ) {
        const { id, payload } = action;
        const authenticatedUser = this._store.selectSnapshot(AuthState.user);
        return this.ajustesService.editUsuario(id, payload).pipe(
            tap((user: Usuario) => {
                const state = ctx.getState();
                if (state.usuarios) {
                    const usuarios = [...state.usuarios];
                    const usuarioIdx = usuarios.findIndex(
                        (usuario) => usuario.id === id
                    );
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

    @Action(AjustesAction.Delete)
    deleteUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Delete
    ) {
        const { id } = action;
        return this.ajustesService.deleteUsuario(id).pipe(
            tap((user: Usuario) => {
                const state = ctx.getState();
                if (state.usuarios) {
                    const usuarios = [...state.usuarios];
                    const usuarioIdx = usuarios.findIndex(
                        (usuario) => usuario.id === id
                    );
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

    @Action(AjustesAction.Select)
    selectUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Select
    ) {
        const { usuario: selectedUsuario } = action;
        ctx.patchState({ selectedUsuario });
    }

    @Action(AjustesAction.AjustesMode)
    toggleEditMode(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.AjustesMode
    ) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(AjustesAction.Search)
    searchUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Search
    ) {
        const { payload } = action;
        const state = ctx.getState();
        const usuarios = [...state.usuarios];
        const searchResult = usuarios.filter(
            (usuario) =>
                usuario.nombre &&
                usuario.nombre.toLowerCase().includes(payload.toLowerCase())
        );
        ctx.patchState({ searchResult });
    }

    @Action(AjustesAction.ClearAjustesState)
    clearState(ctx: StateContext<AjustesStateModel>) {
        ctx.patchState({
            usuarios: [],
            editMode: 'edit',
            selectedUsuario: null,
            searchResult: [],
        });
    }
}
