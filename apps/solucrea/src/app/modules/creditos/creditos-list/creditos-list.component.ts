import { GetCreditosCount, SelectCredito } from '../_store/creditos.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Status } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth';
import { CajasMode } from 'app/modules/caja/_store';
import { ClientesMode } from 'app/modules/clientes/_store/';
import {
    CreditosState,
    GetClientesCount,
    GetTurnosCount,
    ModeCredito,
    GetAllCreditos,
} from 'app/modules/creditos/_store/';
import { Observable, tap } from 'rxjs';

import { CreditosService } from '../_services/creditos.service';

@Component({
    selector: 'app-creditos-list',
    templateUrl: './creditos-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosListComponent implements OnInit {
    @Select(CreditosState.creditos)
    creditos$!: Observable<ICreditoReturnDto[]>;
    @Select(CreditosState.loading)
    loading$!: Observable<boolean>;
    @Select(CreditosState.clientesCount)
    clientesCount$!: Observable<number>;
    @Select(CreditosState.creditosCount)
    creditosCount$!: Observable<number>;
    @Select(CreditosState.turnosCount)
    turnosCount$!: Observable<number>;

    actions$!: Actions;
    searchInput = new UntypedFormControl();
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
        private _toast: HotToastService,
        private _creditosService: CreditosService
    ) {}

    ngOnInit(): void {
        this._store.dispatch([
            new GetAllCreditos(Status.ABIERTO),
            new GetClientesCount(),
            new GetTurnosCount(),
            new GetCreditosCount(null),
        ]);

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
                    message = `${(error as HttpErrorResponse)['error'].message}`;
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
     * Change filter for Creditos
     */
    changeFilter(e: MatRadioChange) {
        this._store.dispatch(new GetAllCreditos(e.value));
    }

    /**
     *
     * Go to Credito details
     */
    goToDetails(id: string) {
        this._store.dispatch([new Navigate([`creditos/${id}}`]), new ModeCredito('edit'), new SelectCredito(id)]);
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
