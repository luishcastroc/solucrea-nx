import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { FrecuenciaDePago, Prisma } from '.prisma/client';

@Injectable({
    providedIn: 'root',
})
export class AjustesFrecuenciasDePagoService {
    private _environment = environment;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get Frecuencias de Pago
     *
     *
     */
    getFrecuenciasDePago(): Observable<Partial<FrecuenciaDePago>[]> {
        return this._httpClient.get<Partial<FrecuenciaDePago>[]>(`${this._environment.uri}/frecuencias`);
    }

    /**
     *  Get Frecuencia de Pago
     *
     * @param id
     */
    getFrecuenciaDePago(id: string): Observable<Partial<FrecuenciaDePago>> {
        return this._httpClient.get<Partial<FrecuenciaDePago>>(`${this._environment.uri}/frecuencia/${id}`);
    }

    /**
     *  Add Frecuencia de Pago
     *
     * @param Prisma.FrecuenciaDePagoCreateInput
     */
    addFrecuenciaDePago(frecuencia: Prisma.FrecuenciaDePagoCreateInput): Observable<Partial<FrecuenciaDePago>> {
        return this._httpClient.post<Partial<FrecuenciaDePago>>(`${this._environment.uri}/frecuencia`, frecuencia);
    }

    /**
     *  Edit Frecuencia de Pago
     *
     * @param Prisma.FrecuenciaDePagoUpdateInput
     */
    editFrecuenciaDePago(
        id: string,
        frecuencia: Prisma.FrecuenciaDePagoUpdateInput
    ): Observable<Partial<FrecuenciaDePago>> {
        return this._httpClient.put<Partial<FrecuenciaDePago>>(`${this._environment.uri}/frecuencia/${id}`, frecuencia);
    }

    /**
     *  Edit Frecuencia de Pago
     *
     * @param id
     */
    deleteFrecuenciaDePago(id: string): Observable<Partial<FrecuenciaDePago>> {
        return this._httpClient.delete<Partial<FrecuenciaDePago>>(`${this._environment.uri}/frecuencia/${id}`);
    }
}
