import { Injectable } from '@nestjs/common';
import { ICajaReturnDto } from 'api/dtos';
@Injectable()
export class UtilService {
    constructor() {}

    getSaldoActual(caja: ICajaReturnDto | Partial<ICajaReturnDto>): number {
        const { movimientos } = caja;
        const depositos = movimientos.filter((movimiento) => movimiento.tipo === 'DEPOSITO');
        const retiros = movimientos.filter((movimiento) => movimiento.tipo === 'RETIRO');

        let sumRetiros = 0;
        if (retiros.length > 0) {
            for (const retiro of retiros) {
                sumRetiros += Number(retiro.monto);
            }
        }

        let sumDepositos = 0;
        if (depositos.length > 0) {
            for (const deposito of depositos) {
                sumDepositos += Number(deposito.monto);
            }
        }

        return Number(caja.saldoInicial) + sumDepositos - sumRetiros;
    }
}
