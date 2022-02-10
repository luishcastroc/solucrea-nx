import * as moment from 'moment';
import { Moment } from 'moment';
import { ICreditoData, IDetails } from './models';
import { addBusinessDays, calculateDetails } from './utils';

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
        const dateToCheck = moment('2022-01-20');
        const dateResult: Moment = addBusinessDays(dateToCheck, 1);

        expect(dateResult.toISOString()).toEqual('2022-01-21T06:00:00.000Z');
    });
});
