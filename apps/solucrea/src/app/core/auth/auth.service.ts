import { Role } from './../_models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
    private _environment = environment;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: {
        username: string;
        password: string;
    }): Observable<any> {
        // Throw error, if the user is already logged in

        return this._httpClient.post(
            `${this._environment.uri}/auth/login`,
            credentials
        );
    }

    checkAuthorization(userRole: Role, allowedRoles: Role[]): boolean {
        for (const role of allowedRoles) {
            if (role === userRole || role === Role.all) {
                return true;
            }
        }
        return false;
    }
}
