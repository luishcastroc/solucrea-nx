import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSucursalDto, ISucursalReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';

import { environment } from 'apps/solucrea/src/environments/environment';
import { Prisma } from '@prisma/client';

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
    getSucursales(): Observable<ISucursalReturnDto[]> {
        return this._httpClient.get<ISucursalReturnDto[]>(`${this._environment.uri}/sucursales`);
    }

    /**
     *  Get Sucursal
     *
     * @param id
     */
    getSucursal(id: string): Observable<ISucursalReturnDto> {
        return this._httpClient.get<ISucursalReturnDto>(`${this._environment.uri}/sucursal/${id}`);
    }

    /**
     *  Add Sucursal
     *
     * @param CreateSucursalDto
     */
    addSucursal(sucursal: CreateSucursalDto): Observable<ISucursalReturnDto> {
        return this._httpClient.post<ISucursalReturnDto>(`${this._environment.uri}/sucursal`, sucursal);
    }

    /**
     *  Edit Sucursal
     *
     * @param UpdateSucursalDto
     */
    editSucursal(id: string, sucursal: Prisma.SucursalUpdateInput): Observable<ISucursalReturnDto> {
        return this._httpClient.put<ISucursalReturnDto>(`${this._environment.uri}/sucursal/${id}`, sucursal);
    }

    /**
     *  Edit Sucursal
     *
     * @param id
     */
    deleteSucursal(id: string): Observable<ISucursalReturnDto> {
        return this._httpClient.delete<ISucursalReturnDto>(`${this._environment.uri}/sucursal/${id}`);
    }
}
