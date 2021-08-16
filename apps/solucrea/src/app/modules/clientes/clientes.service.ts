import { IActividadEconomicaReturnDto } from './../../../../../api/src/app/dtos/actividad-economica-return.dto';
import { IEstadoCivilReturnDto } from './../../../../../api/src/app/dtos/estado-civil-return.dto';
import { IEscolaridadReturnDto } from './../../../../../api/src/app/dtos/escolaridad-return.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '@prisma/client';
import {
    CreateClienteDto,
    IColoniaReturnDto,
    IGeneroReturnDto,
    ITipoDeViviendaReturnDto,
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
        return this._httpClient.get<Cliente[]>(`${this._environment.uri}/clientes`);
    }

    /**
     *  Get Cliente
     *
     * @param id
     */
    getCliente(id: string): Observable<Cliente> {
        return this._httpClient.get<Cliente>(`${this._environment.uri}/cliente/${id}`);
    }

    /**
     *  Add Cliente
     *
     * @param CreateClienteDto
     */
    addCliente(cliente: CreateClienteDto): Observable<Cliente> {
        return this._httpClient.post<Cliente>(`${this._environment.uri}/cliente`, cliente);
    }

    /**
     *  Edit Cliente
     *
     * @param UpdateClienteDto
     */
    editCliente(id: string, cliente: UpdateClienteDto): Observable<Cliente> {
        return this._httpClient.put<Cliente>(`${this._environment.uri}/cliente/${id}`, cliente);
    }

    /**
     *  Edit Cliente
     *
     * @param id
     */
    deleteCliente(id: string): Observable<Cliente> {
        return this._httpClient.delete<Cliente>(`${this._environment.uri}/cliente/${id}`);
    }

    /**
     *  Get Colonias
     *
     * @param cp
     */
    getColoniasByCp(cp: string): Observable<IColoniaReturnDto> {
        return this._httpClient.get<IColoniaReturnDto>(`${this._environment.uri}/colonias/cp/${cp}`);
    }

    /**
     *  Get Generos
     *
     */
    getGeneros(): Observable<IGeneroReturnDto[]> {
        return this._httpClient.get<IGeneroReturnDto[]>(`${this._environment.uri}/generos/`);
    }

    /**
     *  Get Escolaridades
     *
     */
    getEscolaridades(): Observable<IEscolaridadReturnDto[]> {
        return this._httpClient.get<IEscolaridadReturnDto[]>(`${this._environment.uri}/escolaridades/`);
    }

    /**
     *  Get Tipos de Vivienda
     *
     */
    getTiposDeVivienda(): Observable<ITipoDeViviendaReturnDto[]> {
        return this._httpClient.get<ITipoDeViviendaReturnDto[]>(`${this._environment.uri}/tipos-de-vivienda/`);
    }

    /**
     *  Get Generos
     *
     */
    getEstadosCiviles(): Observable<IEstadoCivilReturnDto[]> {
        return this._httpClient.get<IEstadoCivilReturnDto[]>(`${this._environment.uri}/estados-civiles/`);
    }

    /**
     *  Get Actividades Economicas
     *
     */
    getActividadesEconomicas(): Observable<IActividadEconomicaReturnDto[]> {
        return this._httpClient.get<IActividadEconomicaReturnDto[]>(`${this._environment.uri}/actividades-economicas/`);
    }
}
