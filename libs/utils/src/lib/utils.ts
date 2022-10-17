import { Frecuencia, Pago, Prisma, TipoDePago } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { IAmortizacion, ICajaReturnDto, StatusPago } from 'api/dtos';
import { sumBy } from 'lodash';
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

  const capital = monto / numeroDePagos;
  const interes = capital * (tasaInteres / 100);
  const seguroDiferido = (montoSeguro ? montoSeguro : 0) / numeroDePagos;
  const cuota = capital + interes + seguroDiferido;
  const apertura = comisionPorApertura
    ? monto * (comisionPorApertura / 100)
    : 0;
  const total =
    apertura +
    (modalidadSeguro === 'contado' ? (montoSeguro ? montoSeguro : 0) : 0);
  const mora = cuota * (interesMoratorio / 100) + cuota;
  const seguro =
    modalidadSeguro === 'diferido'
      ? seguroDiferido
      : modalidadSeguro === 'contado'
      ? montoSeguro
        ? montoSeguro
        : 0
      : 0;

  const saldo =
    monto -
    (pagos && pagos.length > 0
      ? sumBy(pagos, pago => Number(pago.monto) - interes)
      : 0);

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
export const addBusinessDays = (
  originalDate: DateTime,
  numDaysToAdd = 1
): DateTime => {
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
export const getSaldoActual = (
  caja: ICajaReturnDto | Partial<ICajaReturnDto>
): number => {
  const { movimientos } = caja;
  const depositos = movimientos?.filter(
    movimiento => movimiento.tipo === 'DEPOSITO'
  );
  const retiros = movimientos?.filter(
    movimiento => movimiento.tipo === 'RETIRO'
  );

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
  pagos: Partial<Pago>[] | Pago[],
  montoMora: Prisma.Decimal
): IAmortizacion[] => {
  const amortizacion: IAmortizacion[] = [];
  const today = DateTime.now()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toLocal()
    .toISODate();
  let fechaPagoAux =
    fechaInicio instanceof Date ? fechaInicio.toISOString() : fechaInicio;
  let status: StatusPago = StatusPago.corriente;
  amortizacion.push({
    numeroDePago: 1,
    fechaDePago: DateTime.fromISO(fechaPagoAux).toLocal().toISODate(),
    monto,
    status,
  });
  for (let i = 2; i < numeroDePagos + 1; i++) {
    const fechaPlusDays = addBusinessDays(
      DateTime.fromISO(fechaPagoAux).toLocal(),
      frecuencia
    );
    const fechaDePago: Date | string = fechaPlusDays.toLocal().toISODate();
    status = StatusPago.corriente;
    amortizacion.push({ numeroDePago: i, fechaDePago, monto, status });
    fechaPagoAux = fechaPlusDays.toISODate();
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
  return mora.length > 0
    ? mora.reduce((acc, obj) => acc + obj.monto.toNumber(), 0)
    : 0;
};

/**
 *
 * @param amortizacion
 * @param cuota
 * @returns pago para no generar intereses
 */
export const getPagoNoIntereses = (
  amortizacion: IAmortizacion[],
  cuota: Prisma.Decimal
): number => {
  const today = DateTime.now()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toUTC()
    .toLocal();
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
  pagos: Partial<Pago>[] | Pago[],
  today: string,
  montoMora: Prisma.Decimal
): IAmortizacion[] => {
  let acum =
    pagos.length > 0
      ? (pagos as Pago[]).reduce((acc, obj) => acc + obj.monto.toNumber(), 0)
      : 0;
  let statusReturn: StatusPago = StatusPago.corriente;
  const evalAmortizacion: IAmortizacion[] = amortizacion.map(
    ({ numeroDePago, fechaDePago, monto }) => {
      let montoReturn: Prisma.Decimal = monto;
      const todayEval = getDateWithFormat(today);
      const fechaDePagoEval = getDateWithFormat(fechaDePago as string);
      const pagoExists = existPagoOrAbono(
        pagos,
        fechaDePagoEval,
        monto.toNumber()
      );

      if (todayEval > fechaDePagoEval) {
        if (acum > 0) {
          if (pagoExists && acum >= monto.toNumber()) {
            montoReturn = new Prisma.Decimal(monto.toNumber());
            statusReturn = StatusPago.pagado;
          } else if (acum >= monto.toNumber()) {
            montoReturn = new Prisma.Decimal(montoMora.toNumber());
            statusReturn = StatusPago.pagado;
          } else {
            montoReturn = new Prisma.Decimal(montoMora.toNumber());
            statusReturn = StatusPago.adeuda;
          }
        } else {
          montoReturn = new Prisma.Decimal(montoMora.toNumber());
          statusReturn = StatusPago.adeuda;
        }
        acum =
          Math.round((acum - montoReturn.toNumber() + Number.EPSILON) * 100) /
          100;
      } else {
        if (acum > 0 && acum >= monto.toNumber()) {
          statusReturn = StatusPago.pagado;
          acum =
            Math.round((acum - montoReturn.toNumber() + Number.EPSILON) * 100) /
            100;
        } else {
          montoReturn = new Prisma.Decimal(monto.toNumber());
          statusReturn = StatusPago.corriente;
          acum = 0;
        }
      }
      return {
        numeroDePago,
        fechaDePago,
        status: statusReturn,
        monto: montoReturn,
      };
    }
  );

  return evalAmortizacion;
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
 * @returns boolean
 */
export const existPagoOrAbono = (
  pagos: Partial<Pago>[] | Pago[],
  fechaPago: DateTime,
  monto: number
): boolean =>
  pagos.some(pago => {
    if (pago) {
      if (pago.monto && pago.fechaDePago) {
        const paymentGreaterThanAmt = pago.monto.toNumber() >= monto;
        const fechaPagoMade = DateTime.fromISO(
          pago.fechaDePago.toISOString()
        ).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        const dateLowerOrEquAmtDt = fechaPagoMade <= fechaPago;

        if (paymentGreaterThanAmt && dateLowerOrEquAmtDt) {
          return true;
        }
      }
    }
    return false;
  });
