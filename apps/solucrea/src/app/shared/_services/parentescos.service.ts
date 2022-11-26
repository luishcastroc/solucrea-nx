import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IParentescoReturnDto } from 'api/dtos';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParentescosService {
  private _environment = environment;
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Get Parentescos
   *
   *
   */
  getParentescos(): Observable<IParentescoReturnDto[]> {
    return this._httpClient.get<IParentescoReturnDto[]>(`${this._environment.uri}/parentescos`);
  }
}
