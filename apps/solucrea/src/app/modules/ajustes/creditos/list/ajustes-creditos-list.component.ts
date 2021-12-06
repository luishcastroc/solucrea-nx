import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AjustesCreditosState, AjustesModeCredito, DeleteCredito, GetAllCreditos } from 'app/modules/ajustes/_store';
import { map, Observable, startWith, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

import { Producto } from '.prisma/client';

@Component({
    selector: 'app-list',
    templateUrl: './ajustes-creditos-list.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesCreditosListComponent implements OnInit, OnDestroy {
    @Select(AjustesCreditosState.creditos) creditos$: Observable<Producto[]>;
    @Select(AjustesCreditosState.loading) loading$: Observable<boolean>;
    searchResults$: Observable<Producto[]>;
    searchInput = new FormControl();
    actions$: Observable<Actions>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {
        this.actions$ = this.subscribeToActions();
    }

    ngOnInit(): void {
        this._store.dispatch(new GetAllCreditos());

        // generating a new observable from the searchInput based on the criteria
        this.searchResults$ = this.searchInput.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            startWith(''),
            withLatestFrom(this.creditos$),
            map(([value, creditos]) => this._filter(value, creditos))
        );
    }

    /**
     * Function to configure to actions
     *
     *
     */
    subscribeToActions(): Actions {
        return this._actions$.pipe(
            takeUntil(this._unsubscribeAll),
            ofActionCompleted(GetAllCreditos, DeleteCredito),
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
                    if (action instanceof DeleteCredito) {
                        message = 'Sucursal desactivada exitosamente.';
                    }
                    if (!(action instanceof GetAllCreditos)) {
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
     *
     * Function to edit Producto
     *
     * @param id string
     */
    editProduco(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${id}`])]);
    }

    /**
     *
     * Function to delete Producto
     *
     * @param id string
     */
    deleteProducto(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${id}`])]);
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
