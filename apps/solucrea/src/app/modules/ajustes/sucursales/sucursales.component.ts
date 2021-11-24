import { ClearSucursales } from './../_store/sucursales/ajustes-sucursales.actions';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-sucursales',
    templateUrl: './sucursales.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalesComponent implements OnInit, OnDestroy {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._store.dispatch(new ClearSucursales());
    }
}
