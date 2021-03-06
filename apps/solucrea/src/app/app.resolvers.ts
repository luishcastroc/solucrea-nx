import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Select } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { InitialData } from 'app/app.types';
import { forkJoin, map, Observable, of } from 'rxjs';

import { AuthState } from 'app/core/auth/store';
import { defaultNavigation } from 'app/core/config/app.config';

@Injectable({
    providedIn: 'root',
})
export class InitialDataResolver implements Resolve<any> {
    @Select(AuthState.user)
    user$!: Observable<Usuario>;
    private _navigation = defaultNavigation;
    /**
     * Constructor
     */
    constructor() {}

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
