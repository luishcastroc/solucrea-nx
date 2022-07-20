import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { IColoniaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import {
    AddSucursal,
    AjustesSucursalesState,
    ClearSucursalState,
    EditSucursal,
    GetColonias,
    SelectSucursal,
} from 'app/modules/ajustes/_store';
import { SharedService } from 'app/shared';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { TipoDireccion } from '.prisma/client';

@Component({
    selector: 'app-sucursales-details',
    templateUrl: './sucursales-details.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalesDetailsComponent implements OnInit, OnDestroy {
    @Select(AjustesSucursalesState.loading)
    loading$!: Observable<boolean>;
    loading = false;
    editMode$!: Observable<EditMode>;
    colonias$!: Observable<IColoniaReturnDto | undefined>;
    actions$!: Actions;
    selectedSucursal$!: Observable<ISucursalReturnDto | undefined>;
    sucursalForm!: UntypedFormGroup;
    editMode!: EditMode;
    coloniasTemp$!: Observable<IColoniaReturnDto | []>;
    phoneInputMask = createMask({
        mask: '(999)-999-99-99',
        autoUnmask: true,
    });

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _formBuilder: UntypedFormBuilder,
        private _actions$: Actions,
        private _sharedService: SharedService,
        private _toast: HotToastService,
        private _route: ActivatedRoute,
        private _cdr: ChangeDetectorRef
    ) {}

    get id() {
        return this.sucursalForm.get('id') as UntypedFormControl;
    }

    get nombre() {
        return this.sucursalForm.get('nombre') as UntypedFormControl;
    }

    get telefono() {
        return this.sucursalForm.get('telefono') as UntypedFormControl;
    }

    get cp() {
        return this.sucursalForm.get('direccion')?.get('codigoPostal') as UntypedFormControl;
    }

    get colonia() {
        return this.sucursalForm.get('direccion')?.get('colonia') as UntypedFormControl;
    }

    get calle() {
        return this.sucursalForm.get('direccion')?.get('calle') as UntypedFormControl;
    }

    get numero() {
        return this.sucursalForm.get('direccion')?.get('numero') as UntypedFormControl;
    }

    get ciudad() {
        return this.sucursalForm.get('direccion')?.get('ciudad') as UntypedFormControl;
    }

    get estado() {
        return this.sucursalForm.get('direccion')?.get('estado') as UntypedFormControl;
    }

    ngOnInit(): void {
        this.sucursalForm = this.createSucursalForm();
        this.subscribeToActions();
        this.initializeData(this._route.snapshot.paramMap.get('id'));
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$
            .pipe(
                ofActionCompleted(AddSucursal, EditSucursal),
                takeUntil(this._unsubscribeAll),
                tap((result) => {
                    const { error, successful } = result.result;
                    const { action } = result;
                    this.loading = false;
                    // Mark for check
                    this._cdr.markForCheck();
                    if (error) {
                        const message = `${(error as HttpErrorResponse)['error'].message}`;
                        this._toast.error(message, {
                            duration: 4000,
                            position: 'bottom-center',
                        });
                    }
                    if (successful) {
                        let message;
                        if (action instanceof AddSucursal) {
                            message = 'Sucursal salvada exitosamente.';
                            this.sucursalForm.reset();
                        } else {
                            message = 'Sucursal actualizada exitosamente.';
                            this.sucursalForm.markAsPristine();
                            // we enable the form
                            this.sucursalForm.enable();
                        }
                        this._toast.success(message, {
                            duration: 4000,
                            position: 'bottom-center',
                        });
                    }
                    this.sucursalForm.enable();
                })
            )
            .subscribe();
    }

    /**
     *
     * Initialize the selectors for the mode and colonias
     *
     */
    initializeData(id: string | null): void {
        this.editMode$ = this._store.select(AjustesSucursalesState.editMode).pipe(
            tap((edit) => {
                this.editMode = edit;

                if (edit === 'edit') {
                    if (id) {
                        this._store.dispatch(new SelectSucursal(id));
                    }
                }

                this.colonias$ = this._store.select(AjustesSucursalesState.colonias).pipe(
                    tap((colonias: IColoniaReturnDto | undefined) => {
                        if (colonias) {
                            this.ciudad.patchValue(colonias.ciudad.descripcion);
                            this.estado.patchValue(colonias.estado.descripcion);
                        }
                    })
                );

                this.selectedSucursal$ = this._store.select(AjustesSucursalesState.selectedSucursal).pipe(
                    tap((sucursal: ISucursalReturnDto | undefined) => {
                        if (sucursal) {
                            this.sucursalForm.patchValue({
                                ...sucursal,
                                direccion: {
                                    ...sucursal.direccion,
                                    colonia: sucursal.direccion.colonia.id,
                                    codigoPostal: sucursal.direccion.colonia.codigoPostal,
                                },
                            });

                            this.getColonias(sucursal.direccion.colonia.codigoPostal);
                        }
                    })
                );
            })
        );
    }

    /**
     * Create SucursalForm
     *
     */
    createSucursalForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [''],
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
     * Function to save sucursal into the database
     *
     *
     */
    saveSucursal(): void {
        this.loading = true;
        if (this.editMode === 'new') {
            this.sucursalForm.disable();
            this._store.dispatch(new AddSucursal(this.sucursalForm.value));
        } else if (this.editMode === 'edit') {
            const sucursalEdit = this._sharedService.getDirtyValues(this.sucursalForm);
            this._store.dispatch(new EditSucursal(this.id.value, sucursalEdit));
        }
    }

    /**
     * Volver a Sucursales
     */
    back(): void {
        this._store.dispatch(new Navigate(['/ajustes/sucursales']));
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearSucursalState());
    }
}
