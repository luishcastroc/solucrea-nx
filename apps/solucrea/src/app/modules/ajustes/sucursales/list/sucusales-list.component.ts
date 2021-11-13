import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Sucursal } from '@prisma/client';
import { ISucursalReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { ConfirmationDialogComponent } from 'app/shared';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AjustesModeSucursal, DeleteSucursal, GetAllSucursales } from '../../_store/ajustes-sucursales.actions';

@Component({
    selector: 'app-sucusales-list',
    templateUrl: './sucusales-list.component.html',
    styleUrls: ['./sucusales-list.component.scss'],
})
export class SucusalesListComponent implements OnInit, OnDestroy {
    sucursales$: Observable<ISucursalReturnDto[]>;

    sucursales: ISucursalReturnDto[];
    searchResults$: Observable<ISucursalReturnDto[]>;
    searchInput = new FormControl();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAllSucursales());

        this.sucursales$ = this._store.select(AjustesState.sucursales).pipe(
            tap((sucursales: ISucursalReturnDto[]) => {
                if (sucursales.length > 0) {
                    this.sucursales = sucursales;
                }
            })
        );

        // generating a new observable from the searchInput based on the criteria
        this.searchResults$ = this.searchInput.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    /**
     * Navigate to a new user creating a GUID for reference
     *
     * @param item
     *
     */
    openNewSucursal(): void {
        this._store.dispatch([
            new Navigate([`ajustes/sucursales/${AuthUtils.guid()}`]),
            new AjustesModeSucursal('new'),
        ]);

        this.subscribeToActions();
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionCompleted(DeleteSucursal)).subscribe((result) => {
            const { error, successful } = result.result;
            if (error) {
                const message = `${error['error'].message}`;
                this._toast.error(message, {
                    duration: 4000,
                    position: 'bottom-center',
                });
            }
            if (successful) {
                const message = 'Sucursal Borrada exitosamente.';
                this._toast.success(message, {
                    duration: 4000,
                    position: 'bottom-center',
                });
            }
        });
    }

    /**
     *
     * Function to edit Sucursales
     *
     * @param id string
     */
    editSucursal(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/sucursales/${id}`]), new AjustesModeSucursal('edit')]);
    }

    /**
     * Delete the selected sucursal
     *
     * @param id
     *
     */
    deleteSucursal({ id, nombre }: Sucursal): void {
        const confirmDialog = this._dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Confirmar Borrar Sucursal',
                message: `Estas seguro que deseas borrar la sucursal: ${nombre}`,
            },
        });
        confirmDialog.afterClosed().subscribe((result) => {
            if (result === true) {
                this._store.dispatch(new DeleteSucursal(id));
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     *
     * @param value
     * Function to filter results on sucursales
     *
     */
    private _filter(value: string): ISucursalReturnDto[] {
        //getting the value from the input
        const filterValue = value.toLowerCase();
        if (filterValue === '') {
            return this.sucursales;
        }

        // returning the filtered array
        return this.sucursales.filter((sucursal) => sucursal.nombre.toLowerCase().includes(filterValue));
    }
}
