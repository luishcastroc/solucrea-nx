import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Logout } from './store/auth.actions';
import { AuthState } from './store/auth.state';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    constructor(private _store: Store) {}

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object
        let newReq = req.clone();

        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        if (
            this._store.selectSnapshot(AuthState.accessToken) &&
            !AuthUtils.isTokenExpired(this._store.selectSnapshot(AuthState.accessToken))
        ) {
            newReq = req.clone({
                headers: req.headers.set(
                    'Authorization',
                    'Bearer ' + this._store.selectSnapshot(AuthState.accessToken)
                ),
            });
        } else {
            this._store.dispatch([new Logout(), new Navigate(['sign-in'])]);
        }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {
                // Catch "401 Unauthorized" responses
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Sign out
                    this._store.dispatch(new Logout());
                }

                return throwError(error);
            })
        );
    }
}
