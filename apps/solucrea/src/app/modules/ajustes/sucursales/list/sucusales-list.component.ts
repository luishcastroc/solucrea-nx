import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Sucursal } from '@prisma/client';
import { ISucursalReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth';
import {
    AjustesModeSucursal,
    AjustesSucursalesState,
    DeleteSucursal,
    GetAllSucursales,
} from 'app/modules/ajustes/_store';
import { ConfirmationDialogComponent } from 'app/shared';
import { map, Observable, startWith, Subject, takeUntil, withLatestFrom } from 'rxjs';

@Component({
    selector: 'app-sucusales-list',
    templateUrl: './sucusales-list.component.html',
    styleUrls: [],
})
export class SucusalesListComponent implements OnInit, OnDestroy {
    @Select(AjustesSucursalesState.sucursales) sucursales$: Observable<ISucursalReturnDto[]>;
    @Select(AjustesSucursalesState.loading) loading$: Observable<boolean>;
    searchResults$: Observable<ISucursalReturnDto[]>;
    searchInput = new FormControl();
    values: string[] = ['Activas', 'Inactivas'];
    activa: string = this.values[0];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAllSucursales());

        // generating a new observable from the searchInput based on the criteria
        this.searchResults$ = this.searchInput.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            startWith(''),
            withLatestFrom(this.sucursales$),
            map(([value, sucursales]) => this._filter(value, sucursales))
        );

        this.subscribeToActions();
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
                this.searchInput.updateValueAndValidity({ onlySelf: false, emitEvent: true });
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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     *
     * @param value
     * Function to filter results on sucursales
     *
     */
    private _filter(value: string, sucursales: ISucursalReturnDto[]): ISucursalReturnDto[] {
        //getting the value from the input
        const filterValue = value.toLowerCase();
        if (filterValue === '') {
            return sucursales.filter((sucursal) => sucursal.activa === (this.activa === 'Activos' ? true : false));
        }

        // returning the filtered array
        return sucursales.filter(
            (sucursal) =>
                sucursal.nombre.toLowerCase().includes(filterValue) &&
                sucursal.activa === (this.activa === 'Activos' ? true : false)
        );
    }
}
