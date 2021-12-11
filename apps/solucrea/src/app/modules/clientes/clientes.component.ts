import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearClientesState } from './_store/clientes.actions';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClientesComponent implements OnInit, OnDestroy {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._store.dispatch(new ClearClientesState());
    }
}
