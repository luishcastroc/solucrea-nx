import { Role } from '@prisma/client';
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
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthState } from '../store/auth.state';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;
    user = this._store.selectSnapshot(AuthState.user);
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
        return this._check(redirectUrl, route.data.roles);
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
        return this._check(redirectUrl, childRoute.data.roles);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/', route.data.roles);
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
        return this.isAuthenticated$.pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page
                    this._store.dispatch(new Navigate(['sign-in'], { redirectURL }));

                    // Prevent the access
                    return of(false);
                }

                if (this.user && roles && !this._authService.checkAuthorization(this.user.role, roles)) {
                    return of(false);
                }

                // Allow the access
                return of(true);
            })
        );
    }
}
