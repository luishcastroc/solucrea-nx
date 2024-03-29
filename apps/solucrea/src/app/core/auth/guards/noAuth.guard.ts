import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable, of, switchMap } from 'rxjs';

import { AuthStateSelectors } from '../store';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard  {
  isAuthenticated$!: Observable<boolean>;
  private _store = inject(Store);
  /**
   * Constructor
   */
  constructor() {
    this.isAuthenticated$ = this._store.select(AuthStateSelectors.isAuthenticated);
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
    return this._check();
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
    return this._check();
  }

  /**
   * Can load
   *
   * @param route
   * @param segments
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @private
   */
  private _check(): Observable<boolean> {
    // Check the authentication status
    return this.isAuthenticated$.pipe(
      switchMap(authenticated => {
        // If the user is authenticated...
        if (authenticated) {
          // Redirect to the root
          this._store.dispatch(new Navigate(['']));
          // Prevent the access
          return of(false);
        }

        // Allow the access
        return of(true);
      })
    );
  }
}
