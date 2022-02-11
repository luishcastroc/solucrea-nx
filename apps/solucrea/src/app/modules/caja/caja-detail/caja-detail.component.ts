import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastClose, HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { CreateCajaDto, ICajaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { SharedService } from 'app/shared';
import { Moment } from 'moment';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { AddCaja, CajasState, ClearCajasState, EditCaja, GetAllSucursales, SelectCaja } from 'app/modules/caja/_store';
import { checkIfEndDateBeforeStartDate, futureDateValidator } from '../validators/custom-caja.validators';

@Component({
    selector: 'app-caja-detail',
    templateUrl: './caja-detail.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaDetailComponent implements OnInit, OnDestroy {
    @Select(CajasState.sucursales)
    sucursales$!: Observable<ISucursalReturnDto[]>;
    editMode$!: Observable<EditMode>;
    selectedCaja$!: Observable<ICajaReturnDto | undefined>;
    successToast$!: Observable<HotToastClose>;
    selectedCaja!: ICajaReturnDto;
    editMode!: EditMode;
    cajaForm!: FormGroup;
    currencyInputMask = createMask({
        alias: 'numeric',
        groupSeparator: ',',
        digits: 2,
        digitsOptional: false,
        prefix: '$ ',
        placeholder: '0',
        autoUnmask: true,
    });

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _changeDetectorRef: ChangeDetectorRef,
        private _toast: HotToastService,
        private _route: ActivatedRoute,
        private _shared: SharedService
    ) {}

    get id() {
        return this.cajaForm.controls['id'];
    }

    get saldoInicial() {
        return this.cajaForm.controls['saldoInicial'];
    }

    get fechaApertura() {
        return this.cajaForm.controls['fechaApertura'];
    }

    get sucursal() {
        return this.cajaForm.controls['sucursal'];
    }

    get observaciones() {
        return this.cajaForm.controls['observaciones'];
    }

    get fechaCierre() {
        return this.cajaForm.controls['fechaCierre'];
    }

    get saldoFinal() {
        return this.cajaForm.controls['saldoFinal'];
    }

    get saldoActual() {
        return this.cajaForm.controls['saldoActual'];
    }

    ngOnInit(): void {
        this.subscribeToActions();
        this.initializeData(this._route.snapshot.paramMap.get('id'));
    }

    /**
     *
     * Initialize the selectors for the mode and colonias
     *
     */
    initializeData(id: string | null): void {
        this.editMode$ = this._store.select(CajasState.editMode).pipe(
            tap((edit) => {
                this.editMode = edit;

                this._store.dispatch(new GetAllSucursales());
                this.cajaForm = this.createCajaForm(edit);

                if ((edit === 'edit' || edit === 'cierre') && id) {
                    this.saldoActual.disable();
                    this._store.dispatch(new SelectCaja(id));
                }

                if (edit === 'cierre') {
                    this.saldoInicial.disable();
                    this.observaciones.disable();
                    this.sucursal.disable();
                    this.fechaApertura.disable();
                }

                this.selectedCaja$ = this._store.select(CajasState.selectedCaja).pipe(
                    tap((caja: ICajaReturnDto | undefined) => {
                        if (caja) {
                            this.selectedCaja = caja;
                            this.cajaForm.patchValue({
                                ...caja,
                                sucursal: caja.sucursal.id,
                            });
                        }
                    })
                );
            })
        );
    }

    /**
     * Function get back to caja main page
     *
     *
     */
    back() {
        this._store.dispatch(new Navigate(['/caja']));
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$
            .pipe(ofActionCompleted(AddCaja, EditCaja), takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                const { error, successful } = result.result;
                const { action } = result;
                if (error) {
                    const message = `${(error as HttpErrorResponse)['error'].message}`;
                    this._toast.error(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                }
                if (successful) {
                    const message =
                        this.editMode === 'new'
                            ? 'Turno salvado exitosamente.'
                            : this.editMode === 'cierre'
                            ? 'Turno cerrado exitosamente.'
                            : 'Turno editado exitosamente';
                    this.successToast$ = this._toast.success(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    }).afterClosed;

                    if (action instanceof AddCaja) {
                        this.cajaForm.disable();
                        this.successToast$.pipe(takeUntil(this._unsubscribeAll)).subscribe((e) => {
                            this._store.dispatch(new Navigate(['/caja']));
                        });
                    } else if (action instanceof EditCaja && this.editMode === 'cierre') {
                        this.saldoFinal.disable();
                        this.fechaCierre.disable();
                    }
                }
            });
    }

    /**
     * Create CajaForm
     *
     * @param editMode
     */
    createCajaForm(editMode: EditMode): FormGroup {
        if (editMode === 'new' || editMode === 'edit') {
            return this._formBuilder.group({
                id: [this._route.snapshot.paramMap.get('id')],
                saldoInicial: ['', Validators.required],
                fechaApertura: ['', Validators.required, futureDateValidator()],
                sucursal: ['', Validators.required],
                observaciones: [''],
                saldoActual: [''],
            });
        } else {
            return this._formBuilder.group(
                {
                    id: [this._route.snapshot.paramMap.get('id')],
                    saldoInicial: ['', Validators.required],
                    fechaApertura: ['', Validators.required, futureDateValidator()],
                    sucursal: ['', Validators.required],
                    observaciones: [''],
                    fechaCierre: ['', Validators.required],
                    saldoFinal: ['', Validators.required],
                    saldoActual: [''],
                },
                { validators: checkIfEndDateBeforeStartDate() }
            );
        }
    }

    /**
     * Save caja
     *
     * @param editMode
     */
    saveCaja(editMode: EditMode): void {
        if (editMode === 'new') {
            const fechaApertura = (this.fechaApertura.value as Moment).toISOString();
            const { saldoActual, ...rest } = this.cajaForm.value;
            const caja: CreateCajaDto = { ...rest, fechaApertura };
            this._store.dispatch(new AddCaja(caja));
            this.cajaForm.disable();
        } else if (editMode === 'edit') {
            let changedCaja = this._shared.getDirtyValues(this.cajaForm);
            if (changedCaja.fechaInicio) {
                const fechaApertura = (this.fechaApertura.value as Moment).toISOString();
                const { saldoActual, ...rest } = changedCaja;
                changedCaja = { ...rest, fechaApertura };
            }
            this._store.dispatch(new EditCaja(this.id.value, changedCaja));
        } else {
            const fechaCierre = (this.fechaCierre.value as Moment).toISOString();
            this._store.dispatch(new EditCaja(this.id.value, { fechaCierre, saldoFinal: this.saldoFinal.value }));
        }
    }

    /**
     * Cancel caja
     *
     * @param editMode
     */
    cancelCaja(editMode: EditMode): void {
        if (editMode === 'new') {
            this.cajaForm.markAsPristine();
            this.cajaForm.reset();
        } else if (editMode === 'edit') {
            this.cajaForm.patchValue({
                ...this.selectedCaja,
                sucursal: this.selectedCaja.sucursal.id,
            });
        } else {
            this.fechaCierre.reset();
            this.saldoFinal.reset();
        }
    }

    /**
     * Go Ajuste
     *
     */
    goAjustes() {
        this._store.dispatch(new Navigate(['/ajustes/sucursales']));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearCajasState());
    }
}
