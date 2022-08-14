import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ICajaReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CajasMode, CajasState, GetAll } from 'app/modules/caja/_store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-caja-list',
    templateUrl: './caja-list.component.html',
    styleUrls: ['./caja-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaListComponent implements OnInit {
    cajas$!: Observable<ICajaReturnDto[]>;

    constructor(private _store: Store) {
        this.cajas$ = this._store.select(CajasState.cajas);
    }

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
