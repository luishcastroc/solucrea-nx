import { Frecuencia, Pago, Prisma, TipoDePago } from '@prisma/client';
import { IAmortizacion, ICajaReturnDto, StatusPago } from 'api/dtos';
import { cloneDeep, sumBy } from 'lodash';
import { DateTime } from 'luxon';

import { ICreditoData, IDetails } from './models';

/**
 * Calculate details
 *
 * @param data
 * @returns IDetails
 */
export const calculateDetails = (data: ICreditoData): IDetails => {
  const {
    tasaInteres,
    monto,
    montoSeguro,
    numeroDePagos,
    comisionPorApertura,
    modalidadSeguro,
    pagos,
    interesMoratorio,
  } = data;

  const capital = parseFloat((monto / numeroDePagos).toFixed(2));
  const interes = parseFloat((capital * (tasaInteres / 100)).toFixed(2));
  const seguroDiferido = parseFloat(((montoSeguro ? montoSeguro : 0) / numeroDePagos).toFixed(2));
  const cuota = parseFloat((capital + interes + seguroDiferido).toFixed(2));
  const apertura = parseFloat((comisionPorApertura ? monto * (comisionPorApertura / 100) : 0).toFixed(2));
  const total = parseFloat(
    (apertura + (modalidadSeguro === 'contado' ? (montoSeguro ? montoSeguro : 0) : 0)).toFixed(2)
  );
  const mora = parseFloat((cuota * (interesMoratorio / 100) + cuota).toFixed(2));
  const seguro =
    modalidadSeguro === 'diferido'
      ? seguroDiferido
      : modalidadSeguro === 'contado'
      ? montoSeguro
        ? montoSeguro
        : 0
      : 0;

  const saldo = parseFloat(
    (monto - (pagos && pagos.length > 0 ? sumBy(pagos, pago => Number(pago.monto) - interes) : 0)).toFixed(2)
  );

  const details: IDetails = {
    capital,
    interes,
    cuota,
    apertura,
    total,
    seguro,
    saldo,
    mora,
  };

  return details;
};

/**
 * Add Business Days
 *
 * @param originalDate
 * @param numDaysToAdd
 * @returns DateTime
 */
export const addBusinessDays = (originalDate: DateTime, numDaysToAdd = 1): DateTime => {
  const sunday = 7;
  let daysRemaining = numDaysToAdd;
  let newDate: DateTime = originalDate;

  while (daysRemaining > 0) {
    newDate = newDate.plus({ days: 1 });
    if (newDate.weekday !== sunday) {
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
  if (!caja || !caja.saldoInicial || !caja.movimientos) {
    throw new Error('Argumento inválido: caja debe tener saldoInicial y movimientos');
  }

  const { movimientos } = caja;
  const depositos = movimientos.filter(movimiento => movimiento.tipo === 'DEPOSITO');
  const retiros = movimientos.filter(movimiento => movimiento.tipo === 'RETIRO');

  let sumRetiros = 0;
  let sumDepositos = 0;
  if (retiros && depositos) {
    if (retiros.length > 0) {
      for (const retiro of retiros) {
        if (retiro.monto) {
          sumRetiros += retiro.monto?.toNumber();
        }
      }
    }

    if (depositos.length > 0) {
      for (const deposito of depositos) {
        if (deposito.monto) {
          sumDepositos += deposito.monto.toNumber();
        }
      }
    }
  }

  return caja.saldoInicial.toNumber() + sumDepositos - sumRetiros;
};

/**
 * Generar Tabla Amortizacion
 *
 * @param creditoId
 * @param numeroDePagos
 * @param frecuencia
 * @param fechaInicio
 * @param monto
 * @param interesMoratorio
 * @param pagos
 * @returns tabla de amortización
 */
export const generateTablaAmorizacion = (
  numeroDePagos: number,
  frecuencia: number,
  fechaInicio: string | Date,
  monto: Prisma.Decimal,
  pagos: Pago[],
  montoMora: Prisma.Decimal
): IAmortizacion[] => {
  const amortizacion: IAmortizacion[] = [];
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toLocal().toISODate() as string;
  let fechaPagoAux = fechaInicio instanceof Date ? fechaInicio.toISOString() : fechaInicio;
  let status: StatusPago = StatusPago.corriente;

  amortizacion.push({
    numeroDePago: 1,
    fechaDePago: DateTime.fromISO(fechaPagoAux).toLocal().toISODate() as string,
    monto,
    status,
  });

  for (let i = 2; i < numeroDePagos + 1; i++) {
    const fechaPlusDays = addBusinessDays(DateTime.fromISO(fechaPagoAux).toLocal(), frecuencia);
    const fechaDePago: Date | string = fechaPlusDays.toLocal().toISODate() as string;
    status = StatusPago.corriente;
    amortizacion.push({ numeroDePago: i, fechaDePago, monto, status });
    fechaPagoAux = fechaPlusDays.toISODate() as string;
  }

  return getPagos(amortizacion, pagos, today, montoMora);
};

/**
 *
 * @param amortizacion
 * @returns get saldo vencido
 */
export const getSaldoVencido = (amortizacion: IAmortizacion[]): number => {
  const mora = amortizacion.filter(pago => pago.status === 'ADEUDA');
  return mora.length > 0 ? mora.reduce((acc, obj) => acc + obj.monto.toNumber(), 0) : 0;
};

/**
 *
 * @param amortizacion
 * @param cuota
 * @returns pago para no generar intereses
 */
export const getPagoNoIntereses = (amortizacion: IAmortizacion[], cuota: Prisma.Decimal): number => {
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toUTC().toLocal();
  const vencido = getSaldoVencido(amortizacion);
  const corriente = amortizacion.filter(
    pago =>
      pago.status === 'CORRIENTE' &&
      today.equals(
        DateTime.fromISO(pago.fechaDePago as string)
          .toUTC()
          .toLocal()
      )
  );
  return (corriente.length > 0 ? cuota.toNumber() : 0) + vencido;
};

/**
 *
 * @param amortizacion
 * @param pagos
 * @param today
 * @param interesMoratorio
 * @returns Amortización with pagos
 */
export const getPagos = (
  amortizacion: IAmortizacion[],
  originalPagos: Pago[],
  today: string,
  montoMora: Prisma.Decimal
): IAmortizacion[] => {
  let pagos: Pago[] = cloneDeep(originalPagos);
  let acum = pagos.reduce((acc, obj) => acc + obj.monto.toNumber(), 0);
  const todayEval = getDateWithFormat(today);

  return amortizacion.map(({ numeroDePago, fechaDePago, monto }) => {
    const fechaDePagoEval = getDateWithFormat(fechaDePago as string);
    const [pagoExists, remainingPayments, paidDue] = existPagoOrAbono(
      pagos,
      fechaDePagoEval,
      monto.toNumber(),
      montoMora.toNumber()
    );
    pagos = remainingPayments;

    let statusReturn: StatusPago;
    let montoReturn: Prisma.Decimal;

    if (todayEval > fechaDePagoEval) {
      if (pagoExists && acum >= monto.toNumber()) {
        montoReturn = paidDue ? new Prisma.Decimal(montoMora.toNumber()) : new Prisma.Decimal(monto.toNumber());
        statusReturn = StatusPago.pagado;
      } else {
        montoReturn = new Prisma.Decimal(montoMora.toNumber());
        statusReturn = StatusPago.adeuda;
      }
    } else {
      if (acum > 0 && acum >= monto.toNumber()) {
        montoReturn = new Prisma.Decimal(monto.toNumber());
        statusReturn = StatusPago.pagado;
      } else {
        montoReturn = new Prisma.Decimal(monto.toNumber());
        statusReturn = StatusPago.corriente;
      }
    }

    acum = Math.max(((acum - montoReturn.toNumber()) * 100) / 100, 0);

    return {
      numeroDePago,
      fechaDePago,
      status: statusReturn,
      monto: montoReturn,
    };
  });
};

/**
 *
 * @param date
 * @returns DateTime
 */
export const getDateWithFormat = (date: string): DateTime =>
  DateTime.fromISO(date).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

/**
 *
 * @param pagos
 * @param fechaPago
 * @param monto
 * @param montoMora
 * @returns boolean
 */
export const existPagoOrAbono = (
  pagos: Pago[],
  fechaPago: DateTime,
  monto: number,
  montoMora: number
): [boolean, Pago[], boolean] => {
  let remainingPayments: Pago[] = [...pagos];

  const checkPayment = (
    pago: Pago,
    amount: number,
    compareDateTo: DateTime,
    compareDateFunction: (d1: DateTime, d2: DateTime) => boolean
  ) => {
    return (
      pago &&
      pago.monto &&
      pago.fechaDePago &&
      pago.monto.toNumber() >= amount &&
      compareDateFunction(getDateWithFormat(pago.fechaDePago.toISOString()), compareDateTo)
    );
  };

  for (const pago of remainingPayments) {
    if (checkPayment(pago, monto, fechaPago, (d1, d2) => d1 <= d2)) {
      const updatedPago = cloneDeep(pago);
      updatedPago.monto = updatedPago.monto.minus(monto);

      remainingPayments =
        updatedPago.monto.toNumber() === 0
          ? remainingPayments.filter(payment => payment !== pago)
          : remainingPayments.map(payment => (payment === pago ? updatedPago : payment));

      return [true, remainingPayments, false];
    }

    if (checkPayment(pago, montoMora, fechaPago, (d1, d2) => d1 > d2)) {
      const updatedPago = cloneDeep(pago);
      updatedPago.monto = updatedPago.monto.minus(montoMora);

      remainingPayments =
        updatedPago.monto.toNumber() === 0
          ? remainingPayments.filter(payment => payment !== pago)
          : remainingPayments.map(payment => (payment === pago ? updatedPago : payment));

      return [true, remainingPayments, true];
    }
  }

  return [false, remainingPayments, false];
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
