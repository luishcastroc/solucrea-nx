import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSucursalDto } from 'api/dtos';
import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';
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
    editSucursal(id: string, sucursal: any): Observable<ISucursalReturnDto> {
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
