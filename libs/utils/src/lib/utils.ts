import { ICajaReturnDto } from 'api/dtos';
import { sumBy } from 'lodash';
import { Moment } from 'moment';

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
export const addBusinessDays = (originalDate: Moment, numDaysToAdd: number): Moment => {
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