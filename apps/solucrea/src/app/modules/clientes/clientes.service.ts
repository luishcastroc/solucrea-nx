import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '@prisma/client';
import {
    CreateClienteDto,
    IColoniaReturnDto,
    UpdateClienteDto,
} from 'api/dtos';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ClientesService {
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
    getClientes(): Observable<Cliente[]> {
        return this._httpClient.get<Cliente[]>(
            `${this._environment.uri}/clientes`
        );
    }

    /**
     *  Get Cliente
     *
     * @param id
     */
    getCliente(id: string): Observable<Cliente> {
        return this._httpClient.get<Cliente>(
            `${this._environment.uri}/cliente/${id}`
        );
    }

    /**
     *  Add Cliente
     *
     * @param CreateClienteDto
     */
    addCliente(cliente: CreateClienteDto): Observable<Cliente> {
        return this._httpClient.post<Cliente>(
            `${this._environment.uri}/cliente`,
            cliente
        );
    }

    /**
     *  Edit Cliente
     *
     * @param UpdateClienteDto
     */
    editCliente(id: string, cliente: UpdateClienteDto): Observable<Cliente> {
        return this._httpClient.put<Cliente>(
            `${this._environment.uri}/cliente/${id}`,
            cliente
        );
    }

    /**
     *  Edit Cliente
     *
     * @param id
     */
    deleteCliente(id: string): Observable<Cliente> {
        return this._httpClient.delete<Cliente>(
            `${this._environment.uri}/cliente/${id}`
        );
    }

    /**
     *  Get Colonias
     *
     * @param cp
     */
    getColoniasByCp(cp: string): Observable<IColoniaReturnDto[]> {
        return this._httpClient.get<IColoniaReturnDto[]>(
            `${this._environment.uri}/colonias/cp/${cp}`
        );
    }
}
