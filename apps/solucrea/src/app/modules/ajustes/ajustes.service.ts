import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '@prisma/client';
import { CreateUsuarioDto, UpdateUsuarioDto } from 'api/dtos';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

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
        return this._httpClient.get<Usuario[]>(`${this._environment.uri}/usuarios`);
    }

    /**
     *  Get Usuario
     *
     * @param id
     */
    getUsuario(id: string): Observable<Usuario> {
        return this._httpClient.get<Usuario>(`${this._environment.uri}/usuario/${id}`);
    }

    /**
     *  Add Usuario
     *
     * @param CreateUsuarioDto
     */
    addUsuario(usuario: CreateUsuarioDto): Observable<Usuario> {
        return this._httpClient.post<Usuario>(`${this._environment.uri}/usuario`, usuario);
    }

    /**
     *  Edit Usuario
     *
     * @param UpdateUsuarioDto
     */
    editUsuario(id: string, usuario: UpdateUsuarioDto): Observable<Usuario> {
        return this._httpClient.put<Usuario>(`${this._environment.uri}/usuario/${id}`, usuario);
    }

    /**
     *  Edit Usuario
     *
     * @param id
     */
    deleteUsuario(id: string): Observable<Usuario> {
        return this._httpClient.delete<Usuario>(`${this._environment.uri}/usuario/${id}`);
    }
}
