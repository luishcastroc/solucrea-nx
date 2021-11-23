import { ClearCajasState } from './_store/caja.actions';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-caja',
    templateUrl: './caja.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CajaComponent implements OnInit, OnDestroy {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCajasState());
    }
}
