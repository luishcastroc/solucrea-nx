import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { tap } from 'rxjs/operators';

import { UpdateUsuario } from '../../../core/auth/store/auth.actions';
import { AjustesService } from './../ajustes.service';
import * as UsuarioAction from './ajustes.actions';
import { AjustesStateModel } from './ajustes.model';

@State<AjustesStateModel>({
    name: 'ajustes',
    defaults: {
        usuarios: null,
    },
})
@Injectable()
export class AjustesState {
    constructor(private ajustesService: AjustesService) {}

    @Selector()
    static usuarios(state: AjustesStateModel): Usuario[] | null {
        return state.usuarios;
    }

    @Action(UsuarioAction.GetAll)
    getAllUsuarios(
        ctx: StateContext<AjustesStateModel>,
        action: UsuarioAction.GetAll
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

    @Action(UsuarioAction.Edit)
    editUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: UsuarioAction.Edit
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

    @Action(UsuarioAction.Delete)
    deleteUsuario(
        ctx: StateContext<AjustesStateModel>,
        action: UsuarioAction.Delete
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
}
