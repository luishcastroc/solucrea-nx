import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { IColoniaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models/edit-mode.type';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { GetColonias } from '../../_store/ajustes-sucursales.actions';
import { AddSucursal, EditSucursal } from './../../_store/ajustes-sucursales.actions';
import { ClearSucursalState } from '../../_store/ajustes-usuarios.actions';
import { TipoDireccion } from '.prisma/client';

@Component({
    selector: 'app-sucursales-details',
    templateUrl: './sucursales-details.component.html',
    styleUrls: ['./sucursales-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalesDetailsComponent implements OnInit, OnDestroy {
    @Select(AjustesState.loading) loading$: Observable<boolean>;

    editMode$: Observable<EditMode>;
    colonias$: Observable<IColoniaReturnDto>;
    sucursalForm: FormGroup;
    editMode: EditMode;
    coloniasTemp$: Observable<IColoniaReturnDto>;

    get cp() {
        return this.sucursalForm.get('direccion').get('codigoPostal') as FormControl;
    }

    get ciudad() {
        return this.sucursalForm.get('direccion').get('ciudad') as FormControl;
    }

    get estado() {
        return this.sucursalForm.get('direccion').get('estado') as FormControl;
    }

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _changeDetectorRef: ChangeDetectorRef,
        private _toast: HotToastService,
        private _route: ActivatedRoute
    ) {
        this.initializeData();
    }

    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');
        this.sucursalForm = this.createSucursalForm();
        this.subscribeToActions();
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionCompleted(AddSucursal, EditSucursal))
            .subscribe((result) => {
                const { error, successful } = result.result;
                const { action } = result;
                if (error) {
                    const message = `${error['error'].message}`;
                    this._toast.error(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                }
                if (successful) {
                    const message = 'Sucursal salvada exitosamente.';
                    this._toast.success(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });

                    if (action instanceof AddSucursal) {
                        // we clear the forms
                        this.sucursalForm.reset();
                        this.sucursalForm.reset();
                        setTimeout(() => {
                            this._store.dispatch(new Navigate(['/ajustes/sucursales/']));
                        }, 2000);
                    } else {
                        this.sucursalForm.markAsPristine();
                    }
                }
                // we enable the form
                this.sucursalForm.enable();
            });
    }

    /**
     *
     * Initialize the selectors for the mode and colonias
     *
     */
    initializeData(): void {
        this.editMode$ = this._store.select(AjustesState.editMode).pipe(
            tap((edit) => {
                this.editMode = edit;

                this._changeDetectorRef.markForCheck();
            })
        );

        this.colonias$ = this._store.select(AjustesState.colonias).pipe(
            tap((colonias: IColoniaReturnDto) => {
                if (colonias) {
                    this.ciudad.patchValue(colonias.ciudad.descripcion);
                    this.estado.patchValue(colonias.estado.descripcion);
                }

                this._changeDetectorRef.markForCheck();
            })
        );
    }

    /**
     * Create SucursalForm
     *
     */
    createSucursalForm(): FormGroup {
        return this._formBuilder.group({
            nombre: ['', Validators.required],
            telefono: ['', Validators.required],
            direccion: this._formBuilder.group({
                tipo: [TipoDireccion.SUCURSAL],
                calle: ['', Validators.required],
                numero: ['', Validators.required],
                cruzamientos: [''],
                codigoPostal: ['', Validators.required],
                colonia: ['', Validators.required],
                ciudad: [{ value: '', disabled: true }, Validators.required],
                estado: [{ value: '', disabled: true }, Validators.required],
            }),
        });
    }

    /**
     * function to call the action GetColonias
     *
     * @param cp
     */
    getColonias(cp: string): void {
        this._store.dispatch(new GetColonias(cp));
    }

    /**
     * Function to save cliente into the database
     *
     *
     */
    saveSucursal(): void {
        if (this.editMode === 'new') {
            this.sucursalForm.disable();
            this._store.dispatch(new AddSucursal(this.sucursalForm.value));
        } else if (this.editMode === 'edit') {
            console.log('Edit: ', this.sucursalForm.value);
        }
    }

    /**
     * Volver a Clientes
     */
    back(): void {
        this._store.dispatch(new Navigate(['/ajustes/sucursales']));
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearSucursalState());
    }
}
