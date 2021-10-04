import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { CajaStateModel } from './caja.model';

@State<CajaStateModel>({
    name: 'ajustes',
    defaults: {
        cajas: [],
        editMode: 'edit',
        selectedCaja: undefined,
        loading: false,
    },
})
@Injectable()
export class CajasState {}
