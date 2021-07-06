import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { tap } from 'rxjs/operators';

import { UpdateUsuario } from '../../../core/auth/store/auth.actions';
import { AjustesService } from './../ajustes.service';
import * as AjustesAction from './ajustes.actions';
import { AjustesStateModel } from './ajustes.model';

@State<AjustesStateModel>({
    name: 'ajustes',
    defaults: {
        usuarios: null,
        editMode: 'edit',
        selectedUsuario: null,
    },
})
@Injectable()
export class AjustesState {
    constructor(private ajustesService: AjustesService) {}

    @Selector()
    static usuarios({ usuarios }: AjustesStateModel): Usuario[] | null {
        return usuarios;
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
                });
            })
        );
    }

    @Action(AjustesAction.Edit)
    editUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Edit
    ) {
        const { id, payload } = action;
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
                ctx.dispatch(new UpdateUsuario(user));
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

    @Action(AjustesAction.Mode)
    toggleEditMode(
        ctx: StateContext<AjustesStateModel>,
        action: AjustesAction.Mode
    ) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }
}
