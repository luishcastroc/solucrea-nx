import { HttpErrorResponse } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { EditMode } from 'app/core/models';
import {
    AddCredito,
    AjustesCreditosState,
    ClearCreditoState,
    EditCredito,
    SelectCredito,
} from 'app/modules/ajustes/_store';
import { IDays, IFrecuencia } from 'app/modules/ajustes/models';
import { SharedService } from 'app/shared';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { dias } from '../../_config/dias';
import { defaultFrecuencias } from '../../_config/frecuencias';
import { Producto } from '.prisma/client';

@Component({
    selector: 'app-details',
    templateUrl: './ajustes-creditos-details.component.html',
    styleUrls: ['./ajustes-creditos-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesCreditosDetailsComponent implements OnInit, OnDestroy {
    @Select(AjustesCreditosState.loading)
    loading$!: Observable<boolean>;
    loading = false;
    creditosForm!: FormGroup;
    editMode!: EditMode;
    editMode$!: Observable<EditMode>;
    selectedProducto$!: Observable<Producto | undefined>;
    frecuencias: IFrecuencia[] = defaultFrecuencias;
    days: IDays[] = dias;

    currencyInputMask = createMask({
        alias: 'numeric',
        groupSeparator: ',',
        digits: 2,
        digitsOptional: false,
        prefix: '$ ',
        placeholder: '0',
        autoUnmask: true,
    });

    percentageInputMask = createMask({
        alias: 'numeric',
        digits: 2,
        digitsOptional: false,
        suffix: ' %',
        placeholder: '0',
        autoUnmask: true,
    });

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _sharedService: SharedService,
        private _toast: HotToastService,
        private _route: ActivatedRoute,
        private _cdr: ChangeDetectorRef
    ) {}

    get id() {
        return this.creditosForm.get('id') as FormControl;
    }

    get nombre() {
        return this.creditosForm.get('nombre') as FormControl;
    }

    get descripcion() {
        return this.creditosForm.get('descripcion') as FormControl;
    }

    get montoMinimo() {
        return this.creditosForm.get('montoMinimo') as FormControl;
    }

    get montoMaximo() {
        return this.creditosForm.get('montoMaximo') as FormControl;
    }

    get interes() {
        return this.creditosForm.get('interes') as FormControl;
    }

    get interesMoratorio() {
        return this.creditosForm.get('interesMoratorio') as FormControl;
    }

    get penalizacion() {
        return this.creditosForm.get('penalizacion') as FormControl;
    }

    get comision() {
        return this.creditosForm.get('comision') as FormControl;
    }

    get cargos() {
        return this.creditosForm.get('cargos') as FormControl;
    }

    get numeroDePagos() {
        return this.creditosForm.get('numeroDePagos') as FormControl;
    }

    get frecuencia() {
        return this.creditosForm.get('frecuencia') as FormControl;
    }

    get diaSemana() {
        return this.creditosForm.get('diaSemana') as FormControl;
    }

    get diaMes() {
        return this.creditosForm.get('diaMes') as FormControl;
    }

    get creditosActivos() {
        return this.creditosForm.get('creditosActivos') as FormControl;
    }

    ngOnInit(): void {
        this.creditosForm = this.createCreditosForm();
        this.subscribeToActions();
        this.initializeData(this._route.snapshot.paramMap.get('id'));
    }

    /**
     * Create CreditosForm
     *
     */
    createCreditosForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            montoMinimo: ['', Validators.required],
            montoMaximo: ['', Validators.required],
            interes: ['', Validators.required],
            interesMoratorio: ['', Validators.required],
            penalizacion: ['', Validators.required],
            comision: ['', Validators.required],
            cargos: ['', Validators.required],
            numeroDePagos: ['', Validators.required],
            frecuencia: ['', Validators.required],
            creditosActivos: ['', Validators.required],
            diaSemana: [''],
            diaMes: [''],
        });
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$
            .pipe(ofActionCompleted(AddCredito, EditCredito), takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
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
                    let message = 'Producto salvado exitosamente.';
                    if (action instanceof EditCredito) {
                        message = 'Producto actualizado exitosamente';
                    }
                    this._toast.success(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });

                    if (action instanceof AddCredito) {
                        setTimeout(() => {
                            this._store.dispatch(new Navigate(['/ajustes/creditos/']));
                        }, 2000);
                    } else {
                        this.creditosForm.markAsPristine();
                        // we enable the form
                        this.creditosForm.enable();
                    }
                }
            });
    }

    /**
     *
     * Initialize the selectors for the mode and colonias
     *
     */
    initializeData(id: string | null): void {
        this.editMode$ = this._store.select(AjustesCreditosState.editMode).pipe(
            tap((edit) => {
                this.editMode = edit;

                if (edit === 'edit' && id) {
                    this._store.dispatch(new SelectCredito(id));
                }

                this.selectedProducto$ = this._store.select(AjustesCreditosState.selectedCredito).pipe(
                    tap((credito: Producto | undefined) => {
                        if (credito) {
                            this.creditosForm.patchValue({
                                ...credito,
                            });
                        }
                    })
                );
            })
        );
    }

    /**
     * Function to save credito into the database
     *
     *
     */
    saveCredito(): void {
        this.loading = true;
        if (this.editMode === 'new') {
            this.creditosForm.disable();
            const diaSemana = this.diaSemana.value === '' ? null : this.diaSemana.value;
            const diaMes = this.diaMes.value === '' ? null : this.diaMes.value;
            this._store.dispatch(new AddCredito({ ...this.creditosForm.value, diaMes, diaSemana }));
        } else if (this.editMode === 'edit') {
            const creditoEdit = this._sharedService.getDirtyValues(this.creditosForm);
            this._store.dispatch(new EditCredito(this.id.value, creditoEdit));
        }
    }

    /**
     * Volver a Creditos
     */
    back(): void {
        this._store.dispatch(new Navigate(['/ajustes/creditos']));
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearCreditoState());
    }
}
