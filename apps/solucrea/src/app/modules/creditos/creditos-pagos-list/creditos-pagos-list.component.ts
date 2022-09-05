import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';
import { CreditosState, ModeCredito } from '../_store';

@Component({
    selector: 'app-creditos-pagos-list',
    templateUrl: './creditos-pagos-list.component.html',
    styleUrls: ['./creditos-pagos-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosPagosListComponent implements OnInit {
    loading$!: Observable<boolean>;
    loading: boolean = false;
    selectedCredito$!: Observable<ICreditoReturnDto | undefined>;

    constructor(private _store: Store) {
        this.loading$ = this._store.select(CreditosState.loading);

        this.selectedCredito$ = this._store.select(CreditosState.selectedCredito);
    }

    ngOnInit(): void {}

    goToDetails(): void {
        this._store.dispatch(new ModeCredito('edit'));
    }
}
