import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreditoReturnDto } from 'api/dtos';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Observable } from 'rxjs';

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
    getCreditosCliente(id: string): Observable<ICreditoReturnDto[]> {
        return this._httpClient.get<ICreditoReturnDto[]>(`${this._environment.uri}/creditos/cliente/${id}`);
    }
}