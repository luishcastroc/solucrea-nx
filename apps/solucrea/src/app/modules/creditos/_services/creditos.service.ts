import { ICreditoData } from './../_models/credito-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Prisma, ReferidoPor } from '@prisma/client';
import { ICreditoReturnDto, IModalidadSeguroReturnDto, ISeguroReturnDto, ISucursalReturnDto } from 'api/dtos';
import { environment } from 'apps/solucrea/src/environments/environment';
import { Moment } from 'moment';
import { forkJoin, map, Observable } from 'rxjs';

import { ISegurosData } from '../_models';
import { IDetails } from './../_models/details.model';

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
    calculateDetails(data: ICreditoData): IDetails {
        const { tasaInteres, monto, montoSeguro, numeroDePagos, comisionPorApertura, modalidadSeguro } = data;
        const capital = monto / numeroDePagos;
        const intereses = capital * (tasaInteres / 100);
        const seguroDiferido = modalidadSeguro === 'diferido' ? montoSeguro / numeroDePagos : 0;
        const cuota = capital + intereses + seguroDiferido;
        const apertura = comisionPorApertura ? monto * (comisionPorApertura / 100) : 0;
        const total = apertura + (modalidadSeguro === 'contado' ? montoSeguro : 0);
        const seguro =
            modalidadSeguro === 'diferido' ? seguroDiferido : modalidadSeguro === 'contado' ? montoSeguro : 0;

        const details: IDetails = {
            capital,
            interes: intereses,
            cuota,
            apertura,
            total,
            seguro,
        };

        return details;
    }

    /**
     * Add Business Days
     *
     * @param originalDate Moment
     * @param numDaysToAdd number
     * @returns Moment
     */
    addBusinessDays(originalDate: Moment, numDaysToAdd: number): Moment {
        const sunday = 0;
        let daysRemaining = numDaysToAdd;

        const newDate = originalDate.clone();

        while (daysRemaining > 0) {
            newDate.add(1, 'days');
            if (newDate.day() !== sunday) {
                daysRemaining--;
            }
        }

        return newDate;
    }

    /**
     * Prepare record
     *
     */
    prepareCreditoRecord(creditosForm: FormGroup): Prisma.CreditoCreateInput {
        //getting all the values
        const formValue = creditosForm.value;

        //transform into date strings
        const fechaDesembolso = formValue.fechaDesembolso.toISOString();
        const fechaInicio = formValue.fechaInicio.toISOString();
        const fechaFinal = formValue.fechaFinal.toISOString();
        const fechaDeNacimiento = formValue.aval.fechaDeNacimiento.toISOString();

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
        const creditoReturn: Prisma.CreditoCreateInput = {
            ...rest,
            fechaDesembolso,
            fechaInicio,
            fechaFinal,
            cliente: { connect: { id: rest.cliente } },
            aval: {
                create: { ...rest.aval, parentesco: { connect: { id: rest.aval.parentesco } }, fechaDeNacimiento },
            },
            modalidadDeSeguro: { connect: { id: rest.modalidadSeguro } },
            seguro: { connect: { id: rest.seguro } },
            producto: { connect: { id: rest.producto } },
            sucursal: { connect: { id: rest.sucursal } },
            colocador,
        };

        return creditoReturn;
    }
}
