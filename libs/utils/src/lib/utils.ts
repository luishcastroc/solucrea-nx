import { Frecuencia, Pago } from '@prisma/client';
import { IAmortizacion, ICajaReturnDto, StatusPago } from 'api/dtos';
import { sumBy } from 'lodash';
import * as moment from 'moment';

import { ICreditoData, IDetails } from './models';

/**
 * Calculate details
 *
 * @param data
 * @returns IDetails
 */
export const calculateDetails = (data: ICreditoData): IDetails => {
    const { tasaInteres, monto, montoSeguro, numeroDePagos, comisionPorApertura, modalidadSeguro, pagos } = data;

    const capital = monto / numeroDePagos;
    const interes = capital * (tasaInteres / 100);
    const seguroDiferido = modalidadSeguro === 'diferido' ? (montoSeguro ? montoSeguro : 0 / numeroDePagos) : 0;
    const cuota = capital + interes + seguroDiferido;
    const apertura = comisionPorApertura ? monto * (comisionPorApertura / 100) : 0;
    const total = apertura + (modalidadSeguro === 'contado' ? (montoSeguro ? montoSeguro : 0) : 0);
    const seguro =
        modalidadSeguro === 'diferido'
            ? seguroDiferido
            : modalidadSeguro === 'contado'
            ? montoSeguro
                ? montoSeguro
                : 0
            : 0;

    const saldo = monto - (pagos && pagos.length > 0 ? sumBy(pagos, (pago) => Number(pago.monto) - interes) : 0);

    const details: IDetails = {
        capital,
        interes,
        cuota,
        apertura,
        total,
        seguro,
        saldo,
    };

    return details;
};

/**
 * Add Business Days
 *
 * @param originalDate
 * @param numDaysToAdd
 * @returns Moment
 */
export const addBusinessDays = (originalDate: moment.Moment, numDaysToAdd: number): moment.Moment => {
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
};

/**
 * Get Saldo Actual
 *
 * @param caja
 * @returns number
 */
export const getSaldoActual = (caja: ICajaReturnDto | Partial<ICajaReturnDto>): number => {
    const { movimientos } = caja;
    const depositos = movimientos?.filter((movimiento) => movimiento.tipo === 'DEPOSITO');
    const retiros = movimientos?.filter((movimiento) => movimiento.tipo === 'RETIRO');

    let sumRetiros = 0;
    let sumDepositos = 0;
    if (retiros && depositos) {
        if (retiros.length > 0) {
            for (const retiro of retiros) {
                sumRetiros += Number(retiro.monto);
            }
        }

        if (depositos.length > 0) {
            for (const deposito of depositos) {
                sumDepositos += Number(deposito.monto);
            }
        }
    }

    return Number(caja.saldoInicial) + sumDepositos - sumRetiros;
};

/**
 * Generar Tabla Amortizacion
 *
 * @param numeroDePagos
 * @param frecuencia
 * @param fechaInicio
 * @param pagos
 * @returns tabla de amortización
 */
export const generateTablaAmorizacion = (
    numeroDePagos: number,
    frecuencia: number,
    fechaInicio: string | Date,
    pagos: Partial<Pago>[] | Pago[]
): IAmortizacion[] => {
    const amortizacion: IAmortizacion[] = [];
    const isoDate = new Date().toISOString();
    const today = moment(isoDate);
    let fechaPagoAux = fechaInicio;
    for (let i = 1; i < numeroDePagos + 1; i++) {
        const status: StatusPago = pagos.some((pago) => pago?.numeroDePago === i)
            ? StatusPago.pagado
            : today.isSameOrBefore(moment(fechaPagoAux))
            ? StatusPago.corriente
            : StatusPago.adeuda;
        const fechaDePago: Date | string =
            i === 1 ? fechaPagoAux : addBusinessDays(moment(fechaPagoAux), frecuencia).toISOString();
        amortizacion.push({ numeroDePago: i, fechaDePago, status });
        fechaPagoAux = fechaDePago;
    }
    return amortizacion;
};

/**
 *
 * @param frecuencia
 * @returns frecuencia en días
 */
export const getFrecuencia = (frecuencia: Frecuencia | undefined): number => {
    let dias!: number;
    switch (frecuencia) {
        case 'DIARIO':
            dias = 1;
            break;
        case 'SEMANAL':
            dias = 7;
            break;
        case 'QUINCENAL':
            dias = 15;
            break;
        case 'MENSUAL':
            dias = 30;
            break;
        case 'BIMESTRAL':
            dias = 60;
            break;
        case 'TRIMESTRAL':
            dias = 90;
            break;
        case 'CUATRIMESTRAL':
            dias = 120;
            break;
        case 'SEMESTRAL':
            dias = 180;
            break;
        case 'ANUAL':
            dias = 360;
            break;
    }

    return dias;
};
