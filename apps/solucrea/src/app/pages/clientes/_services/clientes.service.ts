import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
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
import { environment } from 'apps/solucrea/src/environments/environment';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private _environment = environment;
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Get clientes
   *
   *
   */
  getClientes(): Observable<IClienteReturnDto[]> {
    return this._httpClient.get<IClienteReturnDto[]>(`${this._environment.uri}/clientes`);
  }

  /**
   * Get clientes where
   *
   *@param data
   */
  getClientesWhere(search: { data: string }): Observable<IClienteReturnDto[]> {
    return this._httpClient.post<IClienteReturnDto[]>(`${this._environment.uri}/clientes`, search);
  }

  /**
   * Get clientes count
   *
   *@param data
   */
  getClientesCount(): Observable<number> {
    return this._httpClient.get<number>(`${this._environment.uri}/clientes-count`);
  }

  /**
   *  Get Cliente
   *
   * @param id
   */
  getCliente(id: string): Observable<IClienteReturnDto> {
    return this._httpClient.get<IClienteReturnDto>(`${this._environment.uri}/cliente/${id}`);
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
  editCliente(id: string, cliente: UpdateClienteDto): Observable<IClienteReturnDto> {
    return this._httpClient.put<IClienteReturnDto>(`${this._environment.uri}/cliente/${id}`, cliente);
  }

  /**
   *  Inactivate Cliente
   *
   * @param id
   */
  inactivateCliente(id: string): Observable<IClienteReturnDto> {
    return this._httpClient.delete<IClienteReturnDto>(`${this._environment.uri}/cliente/${id}`);
  }

  /**
   *
   * @param clienteForm
   * @param trabajoForm
   *
   * @returns ClienteSaveDto
   */

  prepareClienteCreateObject(clienteForm: UntypedFormGroup, trabajoForm: UntypedFormGroup): CreateClienteDto {
    const {
      apellidoPaterno,
      apellidoMaterno,
      nombre,
      fechaDeNacimiento: fechaLuxon,
      curp,
      rfc,
      escolaridad,
      estadoCivil,
      genero,
      direcciones: direccionesCliente,
      tipoDeVivienda,
      telefono1,
      telefono2,
      porcentajeDeMora,
      porcentajeDePagos,
      multiplos,
      numeroCreditosCrecer,
    } = clienteForm.value;

    const direcciones: IDireccion[] = direccionesCliente.map((dir: Partial<IDireccion>) => ({
      tipo: dir.tipo,
      calle: dir.calle,
      numero: dir.numero,
      cruzamientos: dir.cruzamientos,
      coloniaId: dir.colonia,
    }));

    const fechaDeNacimiento: DateTime = fechaLuxon;
    const fechaToSend = fechaDeNacimiento.toISO() as string;

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
      antiguedad: Number(antiguedad),
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
      porcentajeDeMora,
      porcentajeDePagos,
      multiplos,
      numeroCreditosCrecer,
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
