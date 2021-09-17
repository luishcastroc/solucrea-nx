import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sucursal } from '@prisma/client';
import { CreateSucursalDto } from 'api/dtos';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AjustesSucursalService {
    private _environment = environment;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get sucursales
     *
     *
     */
    getSucursales(): Observable<Sucursal[]> {
        return this._httpClient.get<Sucursal[]>(`${this._environment.uri}/sucursales`);
    }

    /**
     *  Get Sucursal
     *
     * @param id
     */
    getSucursal(id: string): Observable<Sucursal> {
        return this._httpClient.get<Sucursal>(`${this._environment.uri}/sucursal/${id}`);
    }

    /**
     *  Add Sucursal
     *
     * @param CreateSucursalDto
     */
    addSucursal(sucursal: CreateSucursalDto): Observable<Sucursal> {
        return this._httpClient.post<Sucursal>(`${this._environment.uri}/sucursal`, sucursal);
    }

    /**
     *  Edit Sucursal
     *
     * @param UpdateSucursalDto
     */
    editSucursal(id: string, sucursal: any): Observable<Sucursal> {
        return this._httpClient.put<Sucursal>(`${this._environment.uri}/sucursal/${id}`, sucursal);
    }

    /**
     *  Edit Sucursal
     *
     * @param id
     */
    deleteSucursal(id: string): Observable<Sucursal> {
        return this._httpClient.delete<Sucursal>(`${this._environment.uri}/sucursal/${id}`);
    }
}
