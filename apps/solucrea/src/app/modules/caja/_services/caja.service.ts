import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prisma } from '@prisma/client';
import { CreateCajaDto, ICajaReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CajaService {
    private _environment = environment;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get cajas
     *
     *
     */
    getCajas(): Observable<ICajaReturnDto[]> {
        return this._httpClient.get<ICajaReturnDto[]>(`${this._environment.uri}/cajas`);
    }

    /**
     *  Get Caja
     *
     * @param id
     */
    getCaja(id: string): Observable<ICajaReturnDto> {
        return this._httpClient.get<ICajaReturnDto>(`${this._environment.uri}/caja/${id}`);
    }

    /**
     *  Add Caja
     *
     * @param CreateCajaDto
     */
    addCaja(caja: CreateCajaDto): Observable<ICajaReturnDto> {
        return this._httpClient.post<ICajaReturnDto>(`${this._environment.uri}/caja`, caja);
    }

    /**
     *  Edit Caja
     *
     * @param CajaUncheckedUpdateInput
     */
    editCaja(id: string, caja: Prisma.CajaUncheckedUpdateInput): Observable<ICajaReturnDto> {
        return this._httpClient.put<ICajaReturnDto>(`${this._environment.uri}/caja/${id}`, caja);
    }

    /**
     *  Delete Caja
     *
     * @param id
     */
    deleteCaja(id: string): Observable<ICajaReturnDto> {
        return this._httpClient.delete<ICajaReturnDto>(`${this._environment.uri}/caja/${id}`);
    }
}
