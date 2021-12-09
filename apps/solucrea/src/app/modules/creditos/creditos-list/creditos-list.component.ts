import { FormControl } from '@angular/forms';
import { ModeCredito } from './../_store/creditos.actions';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { CreditosState } from './../_store/creditos.state';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { Status } from '@prisma/client';
import { HotToastService } from '@ngneat/hot-toast';
import { GetAllCreditos } from 'app/modules/ajustes/_store';
import { AuthUtils } from 'app/core/auth';
import { Navigate } from '@ngxs/router-plugin';

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
        this._store.dispatch(new GetAllCreditos());

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
}
