import { parentescos } from './../../../../../../../prisma/seed-data';
import { IDetails } from './../_models/details.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IClienteReturnDto,
    ICreditoReturnDto,
    IModalidadSeguroReturnDto,
    ISeguroReturnDto,
    ISucursalReturnDto,
} from 'api/dtos';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { ISegurosData } from '../_models';
import { Prisma } from '@prisma/client';
import { FormGroup } from '@angular/forms';

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

    /**
     * Get Creditos
     *
     *
     */
    getCreditos(): Observable<ICreditoReturnDto[]> {
        return this._httpClient.get<ICreditoReturnDto[]>(`${this._environment.uri}/creditos`);
    }

    /**
     *Get Seguros Data
     *
     * @returns ISegurosData
     */
    getSegurosData(): Observable<ISegurosData> {
        return forkJoin([
            this._httpClient.get<ISeguroReturnDto[]>(`${this._environment.uri}/seguros`),
            this._httpClient.get<IModalidadSeguroReturnDto[]>(`${this._environment.uri}/seguros/modalidades`),
        ]).pipe(
            map(([seguros, modalidadesDeSeguro]) => {
                const data: ISegurosData = { seguros, modalidadesDeSeguro };
                return data;
            })
        );
    }

    /**
     * Get Sucursales with enough money
     *
     * @returns ISucursalReturnDto[]
     */
    getSucursalesWithCaja(minAmount: number, maxAmount: number): Observable<ISucursalReturnDto[]> {
        return this._httpClient.post<ISucursalReturnDto[]>(`${this._environment.uri}/sucursales/caja`, {
            minAmount,
            maxAmount,
        });
    }

    /**
     * Calculate details
     *
     */
    calculateDetails(): IDetails {
        return {} as IDetails;
    }

    /**
     * Prepare record
     *
     */
    prepareCreditoRecord(creditosForm: FormGroup): Prisma.CreditoCreateInput {
        const formValue = creditosForm.value;
        formValue.fechaInicio = formValue.fechaInicio.toISOString();
        formValue.aval.fechaDeNacimiento = formValue.aval.fechaDeNacimiento.toISOString();
        const { id, status, fechaFinal, ...rest } = formValue;
        delete rest.aval.id;
        const creditoReturn: Prisma.CreditoCreateInput = {
            ...rest,
            cliente: { connect: { id: rest.cliente } },
            aval: { create: { ...rest.aval, parentesco: { connect: { id: rest.aval.parentesco } } } },
            modalidadDeSeguro: { connect: { id: rest.modalidadSeguro } },
            seguro: { connect: { id: rest.seguro } },
            producto: { connect: { id: rest.producto } },
            sucursal: { connect: { id: rest.sucursal } },
        };

        return creditoReturn;
    }
}
