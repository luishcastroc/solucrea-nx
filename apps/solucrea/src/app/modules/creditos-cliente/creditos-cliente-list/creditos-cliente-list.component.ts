import { ModeCredito, GetAllCreditosCliente } from './../../creditos/_store/creditos.actions';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { MatDialog } from '@angular/material/dialog';
import { Status } from '.prisma/client';
import { FormControl } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { CreditosState } from '../../creditos/_store/creditos.state';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-creditos-cliente-list',
    templateUrl: './creditos-cliente-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosClienteListComponent implements OnInit {
    @Select(CreditosState.creditos) sucursales$: Observable<ICreditoReturnDto[]>;
    @Select(CreditosState.loading) loading$: Observable<boolean>;
    actions$: Actions;
    searchResults$: Observable<ICreditoReturnDto[]>;
    searchInput = new FormControl();
    values = [
        { display: 'Abiertos', value: Status.ABIERTO },
        { display: 'Cerrados', value: Status.CERRADO },
        { display: 'Suspendidos', value: Status.SUSPENDIDO },
    ];
    status = Status.ABIERTO;
    clienteId: string;
    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.clienteId = this._route.snapshot.paramMap.get('clientId');
        this._store.dispatch(new GetAllCreditosCliente(this.clienteId));

        this.setActions();
    }

    /**
     * Navigate to a new credito creating a GUID for reference
     *
     *
     */
    openNewCredito(): void {
        this._store.dispatch([
            new Navigate([`/creditos-cliente/${this.clienteId}/detail/${AuthUtils.guid()}`]),
            new ModeCredito('new'),
        ]);
    }

    /**
     * Function to set the actions
     *
     *
     */
    setActions(): void {
        this.actions$ = this._actions$.pipe(
            ofActionCompleted(GetAllCreditosCliente),
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
                    if (!(action instanceof GetAllCreditosCliente)) {
                        this._toast.success(message, {
                            duration: 4000,
                            position: 'bottom-center',
                        });
                    }
                    this.searchInput.updateValueAndValidity({ onlySelf: false, emitEvent: true });
                }
            })
        );
    }
}
