import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    @Select(AjustesSucursalesState.loading) loading$: Observable<boolean>;

    editMode$: Observable<EditMode>;
    colonias$: Observable<IColoniaReturnDto>;
    actions$: Actions;
    selectedSucursal$: Observable<ISucursalReturnDto>;
    sucursalForm: FormGroup;
    editMode: EditMode;
    coloniasTemp$: Observable<IColoniaReturnDto>;
    phoneInputMask = createMask({
        mask: '(999)-999-99-99',
        autoUnmask: true,
    });

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _sharedService: SharedService,
        private _toast: HotToastService,
        private _route: ActivatedRoute
    ) {}

    get id() {
        return this.sucursalForm.get('id') as FormControl;
    }

    get nombre() {
        return this.sucursalForm.get('nombre') as FormControl;
    }

    get telefono() {
        return this.sucursalForm.get('telefono') as FormControl;
    }

    get cp() {
        return this.sucursalForm.get('direccion').get('codigoPostal') as FormControl;
    }

    get colonia() {
        return this.sucursalForm.get('direccion').get('colonia') as FormControl;
    }

    get calle() {
        return this.sucursalForm.get('direccion').get('calle') as FormControl;
    }

    get numero() {
        return this.sucursalForm.get('direccion').get('numero') as FormControl;
    }

    get ciudad() {
        return this.sucursalForm.get('direccion').get('ciudad') as FormControl;
    }

    get estado() {
        return this.sucursalForm.get('direccion').get('estado') as FormControl;
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
    initializeData(id: string): void {
        this.editMode$ = this._store.select(AjustesSucursalesState.editMode).pipe(
            tap((edit) => {
                this.editMode = edit;

                this.colonias$ = this._store.select(AjustesSucursalesState.colonias).pipe(
                    tap((colonias: IColoniaReturnDto) => {
                        if (colonias) {
                            this.ciudad.patchValue(colonias.ciudad.descripcion);
                            this.estado.patchValue(colonias.estado.descripcion);
                        }
                    })
                );

                this.selectedSucursal$ = this._store.select(AjustesSucursalesState.selectedSucursal).pipe(
                    tap((sucursal: ISucursalReturnDto) => {
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
    createSucursalForm(): FormGroup {
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
