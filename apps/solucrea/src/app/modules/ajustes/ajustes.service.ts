import { Usuario } from '@prisma/client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AjustesService {
    private _environment = environment;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get usuarios
     *
     *
     */
    getUsuarios(): Observable<Usuario[]> {
        return this._httpClient.get<Usuario[]>(
            `${this._environment.uri}/usuarios`
        );
    }

    /**
     *  Get Usuario
     *
     * @param id
     */
    getUsuario(id: string): Observable<Usuario> {
        return this._httpClient.get<Usuario>(
            `${this._environment.uri}/usuario/${id}`
        );
    }
}
