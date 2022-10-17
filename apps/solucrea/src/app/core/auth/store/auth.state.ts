import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import {
  ClearSucursales,
  ClearSucursalState,
  ClearUsuarios,
  ClearUsuarioState,
  SelectUsuario,
} from 'app/modules/ajustes/_store/';
import { ClearCajasState } from 'app/modules/caja/_store/caja.actions';
import { ClearClientesState } from 'app/modules/clientes/_store/clientes.actions';
import { tap, throwError } from 'rxjs';

import { AuthService } from '../auth.service';
import { ClearAuthState, Login, Logout, UpdateUsuario } from './auth.actions';
import { AuthStateModel } from './auth.model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accessToken: '',
    user: undefined,
  },
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  static accessToken(state: AuthStateModel): string {
    return state.accessToken;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.accessToken;
  }

  @Selector()
  static user(state: AuthStateModel): Usuario | undefined {
    return state.user;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { payload }: Login) {
    const { username, password, redirectURL, rememberMe } = payload;
    const state = ctx.getState();
    if (state.accessToken) {
      return throwError('El usuario ya ingresó al sistema.');
    }
    return this.authService.signIn({ username, password }).pipe(
      tap((result: { accessToken: string; user: Usuario }) => {
        const { accessToken, user } = result;
        ctx.patchState({
          accessToken,
          user,
        });
        if (rememberMe) {
          localStorage.setItem('usuario', username);
        } else {
          localStorage.removeItem('usuario');
        }
        ctx.dispatch([new Navigate([redirectURL]), new SelectUsuario(user)]);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch([
      new ClearClientesState(),
      new ClearUsuarioState(),
      new ClearUsuarios(),
      new ClearSucursalState(),
      new ClearSucursales(),
      new ClearAuthState(),
      new ClearCajasState(),
    ]);
  }

  @Action(ClearAuthState)
  clearState(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      accessToken: '',
      user: undefined,
    });
  }

  @Action(UpdateUsuario)
  updateUsuario(ctx: StateContext<AuthStateModel>, action: UpdateUsuario) {
    const { payload: user } = action;
    ctx.patchState({ user });
  }
}
