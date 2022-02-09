import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree,
} from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Role, Usuario } from '@prisma/client';
import { AuthService } from 'app/core/auth/auth.service';
import { combineLatest, Observable, of, switchMap } from 'rxjs';

import { AuthState } from '../store/auth.state';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    @Select(AuthState.isAuthenticated) isAuthenticated$!: Observable<boolean>;
    @Select(AuthState.user) user$!: Observable<Usuario>;
    /**
     * Constructor
     */
    constructor(private _store: Store, private _authService: AuthService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl, route.data['roles']);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl, childRoute.data['roles']);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/', route.data ? route.data['roles'] : null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string, roles: Role[]): Observable<boolean> {
        // Check the authentication status
        return combineLatest([this.isAuthenticated$, this.user$]).pipe(
            switchMap(([authenticated, user]) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page
                    this._store.dispatch(new Navigate(['sign-in'], { redirectURL }));

                    // Prevent the access
                    return of(false);
                }

                if (user && roles && !this._authService.checkAuthorization(user.role, roles)) {
                    this._store.dispatch(new Navigate(['main']));
                    return of(false);
                }

                // Allow the access
                return of(true);
            })
        );
    }
}
