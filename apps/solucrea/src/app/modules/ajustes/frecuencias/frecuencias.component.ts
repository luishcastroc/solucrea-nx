import { MatDialog } from '@angular/material/dialog';
import { FrecuenciaDePago } from '@prisma/client';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Actions, Select, Store } from '@ngxs/store';
import { AjustesFrecuenciasDePagoState } from '../_store';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'app-frecuencias',
    templateUrl: './frecuencias.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrecuenciasComponent implements OnInit {
    @Select(AjustesFrecuenciasDePagoState.frecuencias) frecuencias$: Observable<Partial<FrecuenciaDePago>[]>;
    @Select(AjustesFrecuenciasDePagoState.loading) loading$: Observable<boolean>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {}

    ngOnInit(): void {}
}
