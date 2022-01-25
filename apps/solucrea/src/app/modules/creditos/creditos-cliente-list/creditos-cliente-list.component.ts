import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { IClienteReturnDto, ICreditoReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CajasMode } from 'app/modules/caja/_store/caja.actions';
import { Observable, tap } from 'rxjs';

import { GetAllCreditosCliente, GetClienteData, GetTurnosCount, ModeCredito } from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { Status } from '.prisma/client';
import { createMask } from '@ngneat/input-mask';

@Component({
    selector: 'app-creditos-cliente-list',
    templateUrl: './creditos-cliente-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosClienteListComponent implements OnInit {
    @Select(CreditosState.creditosCliente) creditos$: Observable<ICreditoReturnDto[]>;
    @Select(CreditosState.creditosClienteFiltered) creditosFiltered$: Observable<ICreditoReturnDto[]>;
    @Select(CreditosState.selectedCliente) cliente$: Observable<IClienteReturnDto>;
    @Select(CreditosState.loading) loading$: Observable<boolean>;
    @Select(CreditosState.turnosCount) turnosCount$: Observable<number>;

    actions$: Actions;
    searchInput = new FormControl();
    values = [
        { display: 'Abiertos', value: Status.ABIERTO },
        { display: 'Cerrados', value: Status.CERRADO },
        { display: 'Suspendidos', value: Status.SUSPENDIDO },
    ];
    status = Status.ABIERTO;
    clienteId: string;
    phoneInputMask = createMask({
        mask: '(999)-999-99-99',
        autoUnmask: true,
    });

    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.clienteId = this._route.snapshot.paramMap.get('clienteId');
        this._store.dispatch([
            new GetAllCreditosCliente(this.clienteId),
            new GetTurnosCount(),
            new GetClienteData(this.clienteId),
        ]);

        this.setActions();
    }

    /**
     * Navigate to a new credito creating a GUID for reference
     *
     *
     */
    openNewCredito(): void {
        this._store.dispatch([
            new Navigate([`creditos/cliente/${this.clienteId}/detail/${AuthUtils.guid()}`]),
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
                }
            })
        );
    }

    /**
     * new Caja
     *
     */
    newCaja(): void {
        this._store.dispatch([new Navigate([`caja/${AuthUtils.guid()}`]), new CajasMode('new')]);
    }
}
