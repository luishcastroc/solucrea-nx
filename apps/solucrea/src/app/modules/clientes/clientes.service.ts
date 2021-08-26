import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cliente } from '@prisma/client';
import {
    CreateClienteDto,
    IActividadEconomicaReturnDto,
    IClienteReturnDto,
    IColoniaReturnDto,
    IEscolaridadReturnDto,
    IEstadoCivilReturnDto,
    IGeneroReturnDto,
    ITipoDeViviendaReturnDto,
    UpdateClienteDto,
} from 'api/dtos';
import { IDireccion } from 'api/dtos/';
import { Moment } from 'moment';
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
    getClientes(): Observable<IClienteReturnDto[]> {
        return this._httpClient.get<IClienteReturnDto[]>(`${this._environment.uri}/clientes`);
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
    addCliente(cliente: CreateClienteDto): Observable<IClienteReturnDto> {
        return this._httpClient.post<IClienteReturnDto>(`${this._environment.uri}/cliente`, cliente);
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
     *
     * @param clienteForm
     * @param trabajoForm
     *
     * @returns ClienteSaveDto
     */

    prepareClienteObject(clienteForm: FormGroup, trabajoForm: FormGroup): CreateClienteDto {
        const {
            apellidoPaterno,
            apellidoMaterno,
            nombre,
            fechaDeNacimiento: fechaMoment,
            curp,
            rfc,
            escolaridad,
            estadoCivil,
            genero,
            direcciones: direccionesCliente,
            tipoDeVivienda,
            telefono1,
            telefono2,
        } = clienteForm.value;

        const direcciones: IDireccion[] = direccionesCliente.map((dir) => ({
            tipo: dir.tipo,
            calle: dir.calle,
            numero: dir.numero,
            cruzamientos: dir.cruzamientos,
            coloniaId: dir.colonia,
        }));

        const fechaDeNacimiento: Moment = fechaMoment;
        const fechaToSend = fechaDeNacimiento.toISOString();

        const {
            nombre: trabajoNombre,
            antiguedad,
            telefono,
            actividadEconomica,
            montoMinimo,
            montoMaximo,
            direccion: direccionTrabajo,
        } = trabajoForm.value;

        const direccion: IDireccion = {
            tipo: direccionTrabajo.tipo,
            calle: direccionTrabajo.calle,
            numero: direccionTrabajo.numero,
            cruzamientos: direccionTrabajo.cruzamientos,
            coloniaId: direccionTrabajo.colonia,
        };

        const trabajo = {
            nombre: trabajoNombre,
            antiguedad,
            telefono,
            actividadEconomica,
            direccion,
        };

        const clienteReturn: CreateClienteDto = {
            apellidoPaterno,
            apellidoMaterno,
            nombre,
            fechaDeNacimiento: fechaToSend,
            curp,
            rfc,
            escolaridad,
            estadoCivil,
            genero,
            direcciones,
            tipoDeVivienda,
            telefono1,
            telefono2,
            trabajo,
            montoMinimo,
            montoMaximo,
        };

        return clienteReturn;
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
