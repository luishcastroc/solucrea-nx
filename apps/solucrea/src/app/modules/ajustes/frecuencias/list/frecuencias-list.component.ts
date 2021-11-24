import { FrecuenciaDePago } from '@prisma/client';
import { Observable } from 'rxjs';

import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AjustesFrecuenciasDePagoState, AjustesModeFrecuencias } from '../../_store';
import { Navigate } from '@ngxs/router-plugin';
import { AuthUtils } from 'app/core/auth';

@Component({
    selector: 'app-frecuencias-list',
    templateUrl: './frecuencias-list.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrecuenciasListComponent implements OnInit {
    @Select(AjustesFrecuenciasDePagoState.frecuencias) sucursales$: Observable<FrecuenciaDePago[]>;
    @Select(AjustesFrecuenciasDePagoState.loading) loading$: Observable<boolean>;

    constructor(private _store: Store) {}

    ngOnInit(): void {}

    /**
     *
     * Add Frecuencia
     */
    addFrecuencua(): void {
        this._store.dispatch([
            new Navigate([`ajustes/frecuencias/${AuthUtils.guid()}`]),
            new AjustesModeFrecuencias('new'),
        ]);
    }
}
