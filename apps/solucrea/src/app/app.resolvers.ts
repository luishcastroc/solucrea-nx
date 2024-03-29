import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { InitialData } from 'app/app.types';
import { AuthStateSelectors } from 'app/core/auth/store';
import { defaultNavigation } from 'app/core/config/app.config';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitialDataResolver  {
  user$!: Observable<Usuario | undefined>;
  private _navigation = defaultNavigation;
  /**
   * Constructor
   */
  constructor(private _store: Store) {
    this.user$ = this._store.select(AuthStateSelectors.slices.user);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   *
   *
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitialData> {
    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([of(this._navigation)]).pipe(
      map(([navigation]) => ({
        navigation,
      }))
    );
  }
}
