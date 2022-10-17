import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'apps/solucrea/src/environments/environment';
import { Prisma, Producto } from '@prisma/client';

@Injectable({
  providedIn: 'root',
})
export class AjustesCreditosService {
  private _environment = environment;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Get Productos
   *
   *
   */
  getProductos(): Observable<Producto[]> {
    return this._httpClient.get<Producto[]>(
      `${this._environment.uri}/productos`
    );
  }

  /**
   *  Get Producto
   *
   * @param id
   */
  getProducto(id: string): Observable<Producto> {
    return this._httpClient.get<Producto>(
      `${this._environment.uri}/producto/${id}`
    );
  }

  /**
   *  Add Producto
   *
   * @param CreateProductoDto
   */
  addProducto(producto: Producto): Observable<Producto> {
    return this._httpClient.post<Producto>(
      `${this._environment.uri}/producto`,
      producto
    );
  }

  /**
   *  Edit Producto
   *
   * @param UpdateProductoDto
   */
  editProducto(
    id: string,
    producto: Prisma.ProductoUpdateInput
  ): Observable<Producto> {
    return this._httpClient.put<Producto>(
      `${this._environment.uri}/producto/${id}`,
      producto
    );
  }

  /**
   *  Edit Producto
   *
   * @param id
   */
  deleteProducto(id: string): Observable<Producto> {
    return this._httpClient.delete<Producto>(
      `${this._environment.uri}/producto/${id}`
    );
  }
}
