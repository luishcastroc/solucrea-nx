import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { Select } from 'app/modules/ajustes/_store/ajustes.actions';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { Login, Logout, UpdateUsuario } from './auth.actions';
import { AuthStateModel } from './auth.model';

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        accessToken: null,
        user: null,
    },
})
@Injectable()
export class AuthState {
    constructor(private authService: AuthService) {}

    @Selector()
    static accessToken(state: AuthStateModel): string | null {
        return state.accessToken;
    }

    @Selector()
    static isAuthenticated(state: AuthStateModel): boolean {
        return !!state.accessToken;
    }

    @Selector()
    static user(state: AuthStateModel): Usuario | null {
        return state.user;
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, { payload }: Login) {
        const { username, password, redirectURL } = payload;
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
                ctx.dispatch([new Navigate([redirectURL]), new Select(user)]);
            })
        );
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        ctx.setState({
            accessToken: null,
            user: null,
        });
    }

    @Action(UpdateUsuario)
    updateUsuario(ctx: StateContext<AuthStateModel>, action: UpdateUsuario) {
        const { payload: user } = action;
        ctx.patchState({ user });
    }
}
