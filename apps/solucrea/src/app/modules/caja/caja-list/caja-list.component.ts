import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { ICajaReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable } from 'rxjs';

import { GetAll } from '../_store/caja.actions';
import { CajasState } from '../_store/caja.state';
import { CajasMode } from './../_store/caja.actions';

@Component({
    selector: 'app-caja-list',
    templateUrl: './caja-list.component.html',
    styleUrls: ['./caja-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaListComponent implements OnInit {
    @Select(CajasState.cajas) cajas$: Observable<ICajaReturnDto[]>;

    constructor(private _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAll());
    }

    /**
     * new Caja
     *
     */
    newCaja(): void {
        this._store.dispatch([new Navigate([`caja/${AuthUtils.guid()}`]), new CajasMode('new')]);
    }

    /**
     *
     * Function to edit Caja
     *
     * @param id string
     */
    editCaja(id: string): void {
        this._store.dispatch([new Navigate([`caja/${id}`]), new CajasMode('edit')]);
    }

    /**
     *
     * Function to close Caja
     *
     * @param id string
     */
    cerrarCaja(id: string): void {
        this._store.dispatch([new Navigate([`caja/${id}`]), new CajasMode('cierre')]);
    }
}
