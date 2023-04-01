import { inject, Injectable } from '@angular/core';
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
import { Store } from '@ngxs/store';
import { Role, Usuario } from '@prisma/client';
import { AuthService } from 'app/core/auth/auth.service';
import { combineLatest, Observable, of, switchMap } from 'rxjs';

import { AuthStateSelectors } from '../store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  isAuthenticated$!: Observable<boolean>;
  user$!: Observable<Usuario | undefined>;
  private _store = inject(Store);
  private _authService = inject(AuthService);
  /**
   * Constructor
   */
  constructor() {
    this.isAuthenticated$ = this._store.select(AuthStateSelectors.isAuthenticated);
    this.user$ = this._store.select(AuthStateSelectors.slices.user);
  }

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
