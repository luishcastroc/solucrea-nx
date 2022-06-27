import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Prisma, ReferidoPor, Status } from '@prisma/client';
import { ICreditoReturnDto, IModalidadSeguroReturnDto, ISeguroReturnDto, ISucursalReturnDto } from 'api/dtos';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Moment } from 'moment';
import { forkJoin, map, Observable } from 'rxjs';

import { ISegurosData } from '@solucrea-utils';

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
     * Get Créditos count
     *
     *
     * @returns Number of créditos active and innactive.
     */
    getCreditosCount(id: string | null): Observable<number> {
        return this._httpClient.get<number>(`${this._environment.uri}/creditos-count/${id}`);
    }
    /**
     * Get Creditos from Cliente
     *
     * @param id
     *
     */
    getCreditosCliente(id: string | null, status: Status): Observable<ICreditoReturnDto[]> {
        return this._httpClient.get<ICreditoReturnDto[]>(`${this._environment.uri}/creditos/cliente/${id}/${status}`);
    }

    /**
     * Get Creditos
     *
     *
     */
    getCreditos(status: Status): Observable<ICreditoReturnDto[]> {
        return this._httpClient.get<ICreditoReturnDto[]>(`${this._environment.uri}/creditos/${status}`);
    }

    /**
     * Get Credito
     *
     *
     */
    getCredito(id: string): Observable<ICreditoReturnDto> {
        return this._httpClient.get<ICreditoReturnDto>(`${this._environment.uri}/credito/${id}`);
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
     * @returns ISucursalReturnDto
     */
    getSucursalesWithCaja(minAmount: number, maxAmount: number): Observable<ISucursalReturnDto[]> {
        return this._httpClient.post<ISucursalReturnDto[]>(`${this._environment.uri}/sucursales/caja`, {
            minAmount,
            maxAmount,
        });
    }

    /**
     *
     * @param  data
     * @returns  ICreditoReturnDto
     */
    createCredito(data: Prisma.CreditoCreateInput): Observable<ICreditoReturnDto> {
        return this._httpClient.post<ICreditoReturnDto>(`${this._environment.uri}/credito`, data);
    }

    /**
     * Prepare record
     *
     * @param creditosForm
     * @returns Prisma.CreditoCreateInput
     */
    prepareCreditoRecord(creditosForm: UntypedFormGroup): Prisma.CreditoCreateInput {
        //getting all the values
        const formValue = creditosForm.value;

        //transform into date strings
        const fechaDesembolso = (formValue.fechaDesembolso as Moment).toISOString();
        const fechaInicio = (formValue.fechaInicio as Moment)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .toISOString();
        const fechaFinal = (formValue.fechaFinal as Moment)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .toISOString();
        const fechaDeNacimiento = (formValue.aval.fechaDeNacimiento as Moment)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .toISOString();

        //removing non used values (they have default in the database)
        const { id, status, ...rest } = formValue;

        //calculating colocador depending on the type.
        const colocador: Prisma.ColocadorCreateNestedOneWithoutCreditoInput =
            formValue.referidoPor.toUpperCase() === ReferidoPor.COLOCADOR
                ? { create: { usuario: { connect: { id: formValue.colocador } } } }
                : { create: { cliente: { connect: { id: formValue.colocador } } } };

        //delete id from the aval (is auto generated)
        delete rest.aval.id;

        //generate the record that will be sent
        const creditoReturn = {
            ...rest,
            fechaDesembolso,
            fechaInicio,
            fechaFinal,
            cliente: { connect: { id: rest.cliente } },
            aval: {
                create: { ...rest.aval, parentesco: { connect: { id: rest.aval.parentesco } }, fechaDeNacimiento },
            },
            modalidadDeSeguro: { connect: { id: rest.modalidadDeSeguro } },
            seguro: { connect: { id: rest.seguro } },
            producto: { connect: { id: rest.producto } },
            sucursal: { connect: { id: rest.sucursal } },
            colocador,
        };

        return creditoReturn;
    }
}
