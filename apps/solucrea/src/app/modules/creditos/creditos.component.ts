import { Store } from '@ngxs/store';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ClearCreditosState } from './_store/creditos.actions';

@Component({
    selector: 'app-creditos',
    templateUrl: './creditos.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CreditosComponent implements OnInit, OnDestroy {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCreditosState());
    }
}
