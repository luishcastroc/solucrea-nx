import { Injectable } from '@angular/core';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { tap } from 'rxjs/operators';

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
                const usuarios = result.filter(user => user.id !== id);
                ctx.patchState({
                    usuarios,
                });
            })
        );
    }
}
