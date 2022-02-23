import { Pago, Prisma } from '@prisma/client';
import { IAmortizacion, StatusPago } from 'api/dtos';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ICreditoData, IDetails } from './models';
import { addBusinessDays, calculateDetails, generateTablaAmorizacion } from './utils';

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

    it('should return the proper date', () => {
        const dateToCheck = moment('2022-01-20').utc(true).utcOffset(0);
        const dateResult: Moment = addBusinessDays(dateToCheck, 1);

        expect(dateResult.toISOString()).toEqual('2022-01-21T00:00:00.000Z');
    });

    it('should return one payment due', () => {
        const fechaDeInicio = moment('2022-02-21')
            .utc(true)
            .utcOffset(0)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
            45,
            1,
            fechaDeInicio.toISOString(),
            new Prisma.Decimal(150.0),
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
            new Prisma.Decimal(150.0),
            []
        );

        expect(tablaDeAmortizacion.filter((data) => data.status === StatusPago.adeuda).length === 0).toBeTruthy();
    });

    it('should return one payment made', () => {
        const monto = new Prisma.Decimal(150.0);
        const fechaDeInicio = moment('2022-02-21')
            .utc(true)
            .utcOffset(0)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const pagos: Partial<Pago>[] | Pago[] = [
            {
                id: 'sdjhjh-sdsd-sdsd',
                creditoId: 'jhjh-34hhjh34-3434',
                numeroDePago: 1,
                fechaDePago: fechaDeInicio.toDate(),
                monto,
                tipoDePago: 'REGULAR',
            },
        ];
        const tablaDeAmortizacion: IAmortizacion[] = generateTablaAmorizacion(
            45,
            1,
            fechaDeInicio.toISOString(),
            monto,
            pagos
        );

        expect(tablaDeAmortizacion.filter((data) => data.status === StatusPago.adeuda).length === 0).toBeTruthy();
    });
});
