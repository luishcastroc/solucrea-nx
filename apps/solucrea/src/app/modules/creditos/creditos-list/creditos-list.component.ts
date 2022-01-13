import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Status } from '@prisma/client';
import { IClienteReturnDto, ICreditoReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth';
import { GetAllCreditos } from 'app/modules/ajustes/_store';
import { CajasMode } from 'app/modules/caja/_store/caja.actions';
import { ClientesMode } from 'app/modules/clientes/_store/clientes.actions';
import { Observable, tap } from 'rxjs';

import { ModeCredito, GetClientesCount, GetTurnosCount } from './../_store/creditos.actions';
import { CreditosState } from './../_store/creditos.state';

@Component({
    selector: 'app-creditos-list',
    templateUrl: './creditos-list.component.html',
    styleUrls: ['./creditos-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosListComponent implements OnInit {
    @Select(CreditosState.creditos) creditos$: Observable<ICreditoReturnDto[]>;
    @Select(CreditosState.creditosFiltered) creditosFiltered$: Observable<ICreditoReturnDto[]>;
    @Select(CreditosState.loading) loading$: Observable<boolean>;
    @Select(CreditosState.clientesCount) clientesCount$: Observable<number>;
    @Select(CreditosState.turnosCount) turnosCount$: Observable<number>;
    actions$: Actions;
    searchInput = new FormControl();
    values = [
        { display: 'Abiertos', value: Status.ABIERTO },
        { display: 'Cerrados', value: Status.CERRADO },
        { display: 'Suspendidos', value: Status.SUSPENDIDO },
    ];
    status = Status.ABIERTO;
    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {}

    ngOnInit(): void {
        this._store.dispatch([new GetAllCreditos(), new GetClientesCount(), new GetTurnosCount()]);

        this.setActions();
    }

    /**
     * Navigate to a new credito creating a GUID for reference
     *
     *
     */
    openNewCredito(): void {
        this._store.dispatch([new Navigate([`creditos/${AuthUtils.guid()}`]), new ModeCredito('new')]);
    }

    /**
     * Function to set the actions
     *
     *
     */
    setActions(): void {
        this.actions$ = this._actions$.pipe(
            ofActionCompleted(GetAllCreditos),
            tap((result) => {
                const { error, successful } = result.result;
                const { action } = result;
                let message;
                if (error) {
                    message = `${error['error'].message}`;
                    this._toast.error(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                }
                if (successful) {
                    if (!(action instanceof GetAllCreditos)) {
                        this._toast.success(message, {
                            duration: 4000,
                            position: 'bottom-center',
                        });
                    }
                }
            })
        );
    }

    /**
     *
     * function to generate a new Cliente
     */
    newCliente() {
        this._store.dispatch([new Navigate([`clientes/${AuthUtils.guid()}`]), new ClientesMode('new')]);
    }

    /**
     * new Caja
     *
     */
    newCaja(): void {
        this._store.dispatch([new Navigate([`caja/${AuthUtils.guid()}`]), new CajasMode('new')]);
    }
}
