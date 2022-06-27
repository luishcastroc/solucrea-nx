import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
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
    ChangeSearchFilter,
    DeleteSucursal,
    EditSucursal,
    GetAllSucursales,
} from 'app/modules/ajustes/_store';
import { ConfirmationDialogComponent } from 'app/shared';
import { map, Observable, startWith, tap, withLatestFrom } from 'rxjs';

@Component({
    selector: 'app-sucusales-list',
    templateUrl: './sucusales-list.component.html',
    styleUrls: [],
})
export class SucusalesListComponent implements OnInit {
    @Select(AjustesSucursalesState.sucursales)
    sucursales$!: Observable<ISucursalReturnDto[]>;
    @Select(AjustesSucursalesState.loading)
    loading$!: Observable<boolean>;
    actions$!: Actions;
    searchResults$!: Observable<ISucursalReturnDto[]>;
    searchInput = new UntypedFormControl();
    values = [
        { display: 'Activas', value: true },
        { display: 'Inactivas', value: false },
    ];
    activa = true;

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
            startWith(''),
            withLatestFrom(this.sucursales$),
            map(([value, sucursales]) => this._filter(value, sucursales))
        );

        this.setActions();
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
     * Function to set the actions
     *
     *
     */
    setActions(): void {
        this.actions$ = this._actions$.pipe(
            ofActionCompleted(GetAllSucursales, EditSucursal, DeleteSucursal, ChangeSearchFilter),
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
                    if (action instanceof DeleteSucursal) {
                        message = 'Sucursal desactivada exitosamente.';
                        this._store.dispatch(new ChangeSearchFilter(this.activa));
                    }
                    if (action instanceof EditSucursal) {
                        message = 'Sucursal activada exitosamente.';
                        this._store.dispatch(new ChangeSearchFilter(this.activa));
                    }
                    if (!(action instanceof GetAllSucursales) && !(action instanceof ChangeSearchFilter)) {
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
    deleteSucursal({ id, nombre }: Sucursal | ISucursalReturnDto): void {
        const confirmDialog = this._dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Confirmar desactivar Sucursal',
                message: `Estas seguro que deseas desactivar la sucursal: ${nombre}`,
            },
        });
        confirmDialog.afterClosed().subscribe((result) => {
            if (result === true) {
                this._store.dispatch(new DeleteSucursal(id));
            }
        });
    }

    /**
     * Activate Sucursal
     *
     */
    activateSucursal({ id }: Sucursal | ISucursalReturnDto): void {
        this._store.dispatch(new EditSucursal(id, { activa: true }));
    }

    /**
     * Change radioButton
     */
    changeActiva(e: any): void {
        this._store.dispatch(new ChangeSearchFilter(e.value));
    }

    /**
     *
     * @param value
     * Function to filter results on sucursales
     *
     */
    private _filter(value: string, sucursales: ISucursalReturnDto[]): ISucursalReturnDto[] {
        if (!value || value === '') {
            return sucursales;
        }
        //getting the value from the input
        const filterValue = value.toLowerCase();

        // returning the filtered array
        return sucursales.filter((sucursal) => sucursal.nombre.toLowerCase().includes(filterValue));
    }
}
