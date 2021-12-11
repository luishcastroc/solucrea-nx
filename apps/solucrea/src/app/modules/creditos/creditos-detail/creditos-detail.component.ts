import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetCreditosConfiguration } from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { Producto } from '.prisma/client';

@Component({
    selector: 'app-creditos-detail',
    templateUrl: './creditos-detail.component.html',
    styleUrls: ['./creditos-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosDetailComponent implements OnInit {
    @Select(CreditosState.productos) productos$: Observable<Producto[]>;
    @Select(CreditosState.loading) loading$: Observable<boolean>;
    constructor(
        private _store: Store,
        private _actions$: Actions,
        private _toast: HotToastService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this._store.dispatch(new GetCreditosConfiguration());
    }

    /**
     * Volver a Clientes
     */
    back(): void {
        this.location.back();
    }
}
