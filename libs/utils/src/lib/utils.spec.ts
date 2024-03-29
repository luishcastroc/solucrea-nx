import { Pago, Prisma } from '@prisma/client';
import { IAmortizacion, StatusPago } from 'api/dtos';
import { DateTime } from 'luxon';

import { ICreditoData, IDetails } from './models';
import {
  addBusinessDays,
  calculateDetails,
  generateTablaAmorizacion,
  getPagoNoIntereses,
  getSaldoVencido,
} from './utils';

describe('Utils testing', () => {
  it('should return proper results', () => {
    const data: ICreditoData = {
      monto: 1000,
      interesMoratorio: 15,
      tasaInteres: 7.5,
      cargos: 0,
      comisionPorApertura: 2.5,
      numeroDePagos: 20,
      montoSeguro: 50,
      modalidadSeguro: 'contado',
    };

    const results: IDetails = {
      apertura: 25,
      capital: 50,
      cuota: 56.25,
      interes: 3.75,
      saldo: 1000,
      seguro: 50,
      total: 75,
      mora: 64.69,
    };
    expect(calculateDetails(data)).toEqual(results);
  });

  it('should return saldo vencido', () => {
    const amortizacion: IAmortizacion[] = [
      {
        monto: new Prisma.Decimal(100),
        fechaDePago: DateTime.fromISO('2022-02-21').toUTC().toLocal().toISODate() as string,
        numeroDePago: 1,
        status: StatusPago.adeuda,
      },
      {
        monto: new Prisma.Decimal(100),
        fechaDePago: DateTime.fromISO('2022-02-21').toUTC().toLocal().toISODate() as string,
        numeroDePago: 2,
        status: StatusPago.adeuda,
      },
    ];

    const saldoVencido = getSaldoVencido(amortizacion);

    expect(saldoVencido).toEqual(200);
  });

  it('should return date plus number of days', () => {
    const day = DateTime.fromISO('2022-09-01');

    const dayPlusDays = addBusinessDays(day, 45);

    expect(dayPlusDays.toISO()).toEqual('2022-10-24T00:00:00.000-04:00');
  });

  it('should return pago para no generar intereses', () => {
    const cuota: Prisma.Decimal = new Prisma.Decimal(90);
    const amortizacion: IAmortizacion[] = [
      {
        monto: new Prisma.Decimal(100),
        fechaDePago: DateTime.fromISO('2022-02-21').toUTC().toLocal().toISODate() as string,
        numeroDePago: 1,
        status: StatusPago.adeuda,
      },
      {
        monto: new Prisma.Decimal(100),
        fechaDePago: DateTime.fromISO('2022-02-22').toUTC().toLocal().toISODate() as string,
        numeroDePago: 2,
        status: StatusPago.adeuda,
      },
      {
        monto: new Prisma.Decimal(100),
        fechaDePago: DateTime.now().toUTC().toLocal().toISODate() as string,
        numeroDePago: 3,
        status: StatusPago.corriente,
      },
    ];

    const saldoVencido = getPagoNoIntereses(amortizacion, cuota);

    expect(saldoVencido).toEqual(290);
  });

  it('should return the proper date', () => {
    const dateToCheck = DateTime.fromISO('2022-01-20').toLocal().toUTC();
    const dateResult: DateTime = addBusinessDays(dateToCheck, 1);

    expect(dateResult.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toUTC().toISO()).toEqual(
      '2022-01-21T00:00:00.000Z'
    );
  });

  it('should return one payment due', () => {
    const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toLocal();
    const fechaDeInicio = today.minus({ days: 1 });
    const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
      1,
      1,
      fechaDeInicio.toLocal().toISODate() as string,
      new Prisma.Decimal(150.0),
      [],
      new Prisma.Decimal(172.5)
    );

    expect(tablaDeAmortizacion.filter(data => data.status === StatusPago.adeuda).length === 1).toBeTruthy();
  });

  it('should return no payment due', () => {
    const fechaDeInicio = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toLocal();
    const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
      45,
      1,
      fechaDeInicio.toISODate() as string,
      new Prisma.Decimal(150),
      [],
      new Prisma.Decimal(172.5)
    );

    expect(tablaDeAmortizacion.filter(data => data.status === StatusPago.adeuda).length === 0).toBeTruthy();
  });

  it('should return one payment made', () => {
    const monto = new Prisma.Decimal(150.0);
    const montoMora = new Prisma.Decimal(monto.toNumber() * (15 / 100) + monto.toNumber());
    const fechaDeInicio = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toLocal();
    const pagos: Pago[] = [
      {
        id: 'sdjhjh-sdsd-sdsd',
        creditoId: 'b2d06964-b529-11ec-b909-0242ac120002',
        fechaDePago: fechaDeInicio.toJSDate(),
        monto,
        tipoDePago: 'REGULAR',
        observaciones: 'Pago regular',
        actualizadoPor: 'admin',
        creadoPor: 'admin',
        fechaCreacion: fechaDeInicio.toJSDate(),
        fechaActualizacion: fechaDeInicio.toJSDate(),
        clienteId: 'b2d06964-b529-11ec-b909-0242ac120002',
        cobradorId: 'b2d06964-b529-11ec-b909-0242ac120002',
        sucursalId: 'b2d06964-b529-11ec-b909-0242ac120002',
      },
    ];
    const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
      1,
      1,
      fechaDeInicio.toISODate() as string,
      monto,
      pagos,
      montoMora
    );

    expect(tablaDeAmortizacion.filter(data => data.status === StatusPago.adeuda).length === 0).toBeTruthy();
  });

  it('calculateDetails should return proper results for different inputs', () => {
    const data: ICreditoData = {
      monto: 5000,
      interesMoratorio: 10,
      tasaInteres: 5,
      cargos: 10,
      comisionPorApertura: 5,
      numeroDePagos: 30,
      montoSeguro: 100,
      modalidadSeguro: 'contado',
    };

    const results: IDetails = {
      apertura: 250,
      capital: 166.67,
      cuota: 178.33,
      interes: 8.33,
      saldo: 5000,
      seguro: 100,
      total: 350,
      mora: 196.16,
    };
    expect(calculateDetails(data)).toEqual(results);
  });

  it('getSaldoVencido should handle different amortization inputs', () => {
    const amortizacion: IAmortizacion[] = [
      {
        monto: new Prisma.Decimal(200),
        fechaDePago: DateTime.fromISO('2023-02-21').toUTC().toLocal().toISODate() as string,
        numeroDePago: 1,
        status: StatusPago.adeuda,
      },
      {
        monto: new Prisma.Decimal(300),
        fechaDePago: DateTime.fromISO('2023-02-22').toUTC().toLocal().toISODate() as string,
        numeroDePago: 2,
        status: StatusPago.pagado,
      },
    ];

    const saldoVencido = getSaldoVencido(amortizacion);

    expect(saldoVencido).toEqual(200);
  });

  it('getSaldoVencido should return 0 when no amortization', () => {
    const amortizacion: IAmortizacion[] = [];

    const saldoVencido = getSaldoVencido(amortizacion);

    expect(saldoVencido).toEqual(0);
  });
});
