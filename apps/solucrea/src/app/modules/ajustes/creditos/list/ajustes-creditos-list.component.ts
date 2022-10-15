import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Producto } from '@prisma/client';
import { AuthUtils } from 'app/core/auth/auth.utils';
import {
    AjustesCreditosState,
    AjustesModeCredito,
    ChangeSearchFilterCreditos,
    DeleteCredito,
    EditCredito,
    GetAllCreditos,
} from 'app/modules/ajustes/_store';
import { ConfirmationDialogComponent } from 'app/shared';
import { map, Observable, startWith, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

@Component({
    selector: 'app-list',
    templateUrl: './ajustes-creditos-list.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesCreditosListComponent implements OnInit, OnDestroy {
    creditos$!: Observable<Producto[]>;
    loading$!: Observable<boolean>;
    searchResults$!: Observable<Producto[]>;
    searchInput = new UntypedFormControl();
    actions$: Observable<Actions>;
    values = [
        { display: 'Activos', value: true },
        { display: 'Inactivos', value: false },
    ];
    activo = true;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {
        this.actions$ = this.subscribeToActions();
        this.creditos$ = this._store.select(AjustesCreditosState.creditos);
        this.loading$ = this._store.select(AjustesCreditosState.loading);
    }

    ngOnInit(): void {
        this._store.dispatch(new GetAllCreditos());

        // generating a new observable from the searchInput based on the criteria
        this.searchResults$ = this.searchInput.valueChanges.pipe(
            startWith(''),
            withLatestFrom(this.creditos$),
            map(([value, creditos]) => this._filter(value, creditos)),
            takeUntil(this._unsubscribeAll)
        );
    }

    /**
     * Function to configure to actions
     *
     *
     */
    subscribeToActions(): Actions {
        return this._actions$.pipe(
            ofActionCompleted(GetAllCreditos, EditCredito, DeleteCredito, ChangeSearchFilterCreditos),
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
                    if (action instanceof DeleteCredito) {
                        message = 'Crédito desactivado exitosamente.';
                        this._store.dispatch(new ChangeSearchFilterCreditos(this.activo));
                    }
                    if (action instanceof EditCredito) {
                        message = 'Crédito activado exitosamente.';
                        this._store.dispatch(new ChangeSearchFilterCreditos(this.activo));
                    }
                    if (!(action instanceof GetAllCreditos) && !(action instanceof ChangeSearchFilterCreditos)) {
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

    /**
     * new Producto
     *
     */
    newProducto(): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${AuthUtils.guid()}`]), new AjustesModeCredito('new')]);
    }

    /**
     * Change radioButton
     */
    changeActivo(e: any): void {
        this._store.dispatch(new ChangeSearchFilterCreditos(e.value));
    }

    /**
     *
     * Function to edit Productos
     *
     * @param id string
     */
    editProducto(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${id}`]), new AjustesModeCredito('edit')]);
    }

    /**
     * Delete the selected sucursal
     *
     * @param id
     *
     */
    deleteProducto({ id, nombre }: Producto): void {
        const confirmDialog = this._dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Confirmar desactivar Producto',
                message: `Estas seguro que deseas desactivar el producto: ${nombre}`,
            },
        });
        confirmDialog.afterClosed().subscribe((result) => {
            if (result === true) {
                this._store.dispatch(new DeleteCredito(id));
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     *
     * @param value
     * Function to filter results on productos
     *
     */
    private _filter(value: string, productos: Producto[]): Producto[] {
        if (!value || value === '') {
            return productos;
        }
        //getting the value from the input
        const filterValue = value.toLowerCase();

        // returning the filtered array
        return productos.filter((producto) => producto.descripcion.toLowerCase().includes(filterValue));
    }
}
