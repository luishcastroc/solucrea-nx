import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';
import { CreditosState, ModeCredito } from '../_store';

@Component({
    selector: 'app-creditos-pago',
    templateUrl: './creditos-pago.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosPagoComponent implements OnInit {
    @Select(CreditosState.selectedCredito)
    selectedCredito$!: Observable<ICreditoReturnDto>;
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    back() {
        this._store.dispatch(new ModeCredito('edit'));
    }
}
