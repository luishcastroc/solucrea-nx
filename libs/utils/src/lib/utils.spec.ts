import { Pago, Prisma } from '@prisma/client';
import { IAmortizacion, StatusPago } from 'api/dtos';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ICreditoData, IDetails } from './models';
import {
    addBusinessDays,
    calculateDetails,
    generateTablaAmorizacion,
    getSaldoVencido,
    getPagoNoIntereses,
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
            cuota: 53.75,
            interes: 3.75,
            saldo: 1000,
            seguro: 50,
            total: 75,
        };
        expect(calculateDetails(data)).toEqual(results);
    });

    it('should return saldo vencido', () => {
        const amortizacion: IAmortizacion[] = [
            {
                monto: new Prisma.Decimal(100),
                fechaDePago: moment('2022-02-21')
                    .utc(true)
                    .utcOffset(0)
                    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                    .toDate(),
                numeroDePago: 1,
                status: StatusPago.adeuda,
            },
            {
                monto: new Prisma.Decimal(100),
                fechaDePago: moment('2022-02-21')
                    .utc(true)
                    .utcOffset(0)
                    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                    .toDate(),
                numeroDePago: 2,
                status: StatusPago.adeuda,
            },
        ];

        const saldoVencido = getSaldoVencido(amortizacion);

        expect(saldoVencido).toEqual(200);
    });

    it('should return pago para no generar intereses', () => {
        const cuota: Prisma.Decimal = new Prisma.Decimal(90);
        const amortizacion: IAmortizacion[] = [
            {
                monto: new Prisma.Decimal(100),
                fechaDePago: moment('2022-02-21')
                    .utc(true)
                    .utcOffset(0)
                    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                    .toDate(),
                numeroDePago: 1,
                status: StatusPago.adeuda,
            },
            {
                monto: new Prisma.Decimal(100),
                fechaDePago: moment('2022-02-21')
                    .utc(true)
                    .utcOffset(0)
                    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                    .toDate(),
                numeroDePago: 2,
                status: StatusPago.adeuda,
            },
        ];

        const saldoVencido = getPagoNoIntereses(amortizacion, cuota);

        expect(saldoVencido).toEqual(290);
    });

    it('should return the proper date', () => {
        const dateToCheck = moment('2022-01-20').utc(true).utcOffset(0);
        const dateResult: Moment = addBusinessDays(dateToCheck, 1);

        expect(dateResult.toISOString()).toEqual('2022-01-21T00:00:00.000Z');
    });

    it('should return one payment due', () => {
        const today = moment().utc(true).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const fechaDeInicio = today.subtract(1, 'day');
        const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
            1,
            1,
            fechaDeInicio.local(true).format('YYYY-MM-DD'),
            new Prisma.Decimal(150.0),
            new Prisma.Decimal(15),
            []
        );

        expect(tablaDeAmortizacion.filter((data) => data.status === StatusPago.adeuda).length === 1).toBeTruthy();
    });

    it('should return no payment due', () => {
        const fechaDeInicio = moment().utc(true).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
            45,
            1,
            fechaDeInicio.toISOString(),
            new Prisma.Decimal(150),
            new Prisma.Decimal(15.0),
            []
        );

        expect(tablaDeAmortizacion.filter((data) => data.status === StatusPago.adeuda).length === 0).toBeTruthy();
    });

    it('should return one payment made', () => {
        const monto = new Prisma.Decimal(150.0);
        const fechaDeInicio = moment().utc(true).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const pagos: Partial<Pago>[] | Pago[] = [
            {
                id: 'sdjhjh-sdsd-sdsd',
                creditoId: 'b2d06964-b529-11ec-b909-0242ac120002',
                numeroDePago: 1,
                fechaDePago: fechaDeInicio.toDate(),
                monto,
                tipoDePago: 'REGULAR',
            },
        ];
        const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
            1,
            1,
            fechaDeInicio.toISOString(),
            new Prisma.Decimal(190),
            monto,
            pagos
        );

        expect(tablaDeAmortizacion.filter((data) => data.status === StatusPago.adeuda).length === 0).toBeTruthy();
    });
});
