import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { AuthStateSelectors, Logout } from 'app/core/auth';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'apps/solucrea/src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _store = inject(Store);
  private _environment = environment;

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

    if (newReq.url.includes(this._environment.uri) && !newReq.url.includes('auth')) {
      const token = this._store.selectSnapshot(AuthStateSelectors.slices.accessToken);
      //const isTokenExpired = AuthUtils.isTokenExpired(token);
      if (token /*&& !isTokenExpired*/) {
        newReq = req.clone({
          headers: req.headers.set(
            'Authorization',
            'Bearer ' + this._store.selectSnapshot(AuthStateSelectors.slices.accessToken)
          ),
        });
      } else {
        this._store.dispatch([new Navigate(['sign-in']), new Logout()]);
      }
    }

    // Response
    return next.handle(newReq).pipe(
      catchError(error => {
        // Catch "401 Unauthorized" responses
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Sign out
          //this._store.dispatch(new Navigate(['main']));
        }

        return throwError(() => error);
      })
    );
  }
}
