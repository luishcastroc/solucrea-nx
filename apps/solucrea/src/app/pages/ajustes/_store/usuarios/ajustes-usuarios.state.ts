import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { AuthStateSelectors, UpdateUsuario } from 'app/core/auth';
import { AjustesUsuarioService } from 'app/pages/ajustes/_services';
import { tap } from 'rxjs';

import {
  AddUsuario,
  AjustesModeUsuario,
  ClearUsuarios,
  ClearUsuarioState,
  DeleteUsuario,
  EditUsuario,
  GetAllUsuarios,
  SelectUsuario,
} from './ajustes-usuarios.actions';
import { AjustesUsuariosStateModel } from './ajustes-usuarios.model';

@State<AjustesUsuariosStateModel>({
  name: 'ajustesUsuarios',
  defaults: {
    usuarios: [],
    editMode: 'new',
    selectedUsuario: undefined,
    loading: false,
  },
})
@Injectable()
export class AjustesUsuariosState {
  private _ajustesUsuarioService = inject(AjustesUsuarioService);
  private _store = inject(Store);

  @Action(GetAllUsuarios)
  getAllUsuarios(ctx: StateContext<AjustesUsuariosStateModel>, action: GetAllUsuarios) {
    const { id } = action;
    ctx.patchState({ loading: true });
    return this._ajustesUsuarioService.getUsuarios().pipe(
      tap((result: Usuario[]) => {
        const usuarios = result.filter(user => user.id !== id);
        ctx.patchState({
          usuarios,
          loading: false,
        });
      })
    );
  }

  @Action(AddUsuario)
  addUsuario(ctx: StateContext<AjustesUsuariosStateModel>, action: AddUsuario) {
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
  editUsuario(ctx: StateContext<AjustesUsuariosStateModel>, action: EditUsuario) {
    const { id, payload } = action;
    const authenticatedUser = this._store.selectSnapshot(AuthStateSelectors.slices.user);
    return this._ajustesUsuarioService.editUsuario(id, payload).pipe(
      tap((user: Usuario) => {
        const state = ctx.getState();
        if (state.usuarios) {
          const usuarios = [...state.usuarios];
          const usuarioIdx = usuarios.findIndex(usuario => usuario.id === id);
          usuarios[usuarioIdx] = user;

          ctx.patchState({
            usuarios,
          });
        }
        if (authenticatedUser?.id === user.id) {
          ctx.dispatch(new UpdateUsuario(user));
        }
      })
    );
  }

  @Action(DeleteUsuario)
  deleteUsuario(ctx: StateContext<AjustesUsuariosStateModel>, action: DeleteUsuario) {
    const { id } = action;
    return this._ajustesUsuarioService.deleteUsuario(id).pipe(
      tap((user: Usuario) => {
        const state = ctx.getState();
        if (state.usuarios) {
          const usuarios = [...state.usuarios];
          const usuarioIdx = usuarios.findIndex(usuario => usuario.id === id);
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
  selectUsuario(ctx: StateContext<AjustesUsuariosStateModel>, action: SelectUsuario) {
    const { usuario: selectedUsuario } = action;
    ctx.patchState({ selectedUsuario });
  }

  @Action(AjustesModeUsuario)
  toggleEditModeUsuario(ctx: StateContext<AjustesUsuariosStateModel>, action: AjustesModeUsuario) {
    const { payload } = action;
    ctx.patchState({ editMode: payload });
  }

  @Action(ClearUsuarioState)
  clearUsuarioState(ctx: StateContext<AjustesUsuariosStateModel>) {
    ctx.patchState({
      editMode: 'new',
      selectedUsuario: undefined,
      loading: false,
    });
  }

  @Action(ClearUsuarios)
  clearUsuarios(ctx: StateContext<AjustesUsuariosStateModel>) {
    ctx.patchState({
      usuarios: [],
    });
  }
}
