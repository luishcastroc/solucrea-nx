import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MovimientoDeCaja, Prisma } from '@prisma/client';
import { CreateCajaDto, ICajaReturnDto } from 'api/dtos';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private _environment = environment;
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Get cajas
   *
   *
   */
  getCajas(): Observable<ICajaReturnDto[]> {
    return this._httpClient.get<ICajaReturnDto[]>(
      `${this._environment.uri}/cajas`
    );
  }

  /**
   *  Get Caja
   *
   * @param id
   */
  getCaja(id: string): Observable<ICajaReturnDto> {
    return this._httpClient.get<ICajaReturnDto>(
      `${this._environment.uri}/caja/${id}`
    );
  }

  /**
   *  Add Caja
   *
   * @param CreateCajaDto
   */
  addCaja(caja: CreateCajaDto): Observable<ICajaReturnDto> {
    return this._httpClient.post<ICajaReturnDto>(
      `${this._environment.uri}/caja`,
      caja
    );
  }

  /**
   *  Edit Caja
   *
   * @param CajaUncheckedUpdateInput
   */
  editCaja(
    id: string,
    caja: Prisma.CajaUncheckedUpdateInput
  ): Observable<ICajaReturnDto> {
    return this._httpClient.put<ICajaReturnDto>(
      `${this._environment.uri}/caja/${id}`,
      caja
    );
  }

  /**
   *  Delete Caja
   *
   * @param id
   */
  deleteCaja(id: string): Observable<ICajaReturnDto> {
    return this._httpClient.delete<ICajaReturnDto>(
      `${this._environment.uri}/caja/${id}`
    );
  }

  /**
   * Get turnos count
   *
   *@param data
   */
  getTurnosCount(): Observable<number> {
    return this._httpClient.get<number>(`${this._environment.uri}/cajas-count`);
  }

  /**
   *
   * @param id cajaId
   * @returns Observable<MovimientoDeCaja[]> Array of Movimientos de Caja
   */
  getMovimientos(id: string): Observable<MovimientoDeCaja[]> {
    return this._httpClient.get<MovimientoDeCaja[]>(
      `${this._environment.uri}/movimientos`
    );
  }

  /**
   *
   * @param payload MovimientoDeCajaCreateInput
   * @returns Observable<MovimientoDeCaja>
   */
  addMovimiento(
    payload: Prisma.MovimientoDeCajaCreateInput
  ): Observable<MovimientoDeCaja> {
    return this._httpClient.post<MovimientoDeCaja>(
      `${this._environment.uri}/movimientos`,
      payload
    );
  }
}
