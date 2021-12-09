import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Credito } from '.prisma/client';

@Injectable({
    providedIn: 'root',
})
export class CreditosService {
    private _environment = environment;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get Creditos from Cliente
     *
     * @param id
     *
     */
    getCreditosCliente(id: string): Observable<Credito[]> {
        return this._httpClient.get<Credito[]>(`${this._environment.uri}/creditos/cliente/${id}`);
    }
}
