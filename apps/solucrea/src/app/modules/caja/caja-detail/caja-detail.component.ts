import { ClearCajasState } from './../_store/caja.actions';
import { takeUntil } from 'rxjs/operators';
import { Moment } from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';
import { CajasState } from '../_store/caja.state';
import { HotToastService } from '@ngneat/hot-toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store, Actions, Select, ofActionCompleted } from '@ngxs/store';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Add, GetAllSucursales } from '../_store/caja.actions';
import { createMask } from '@ngneat/input-mask';
import { CreateCajaDto } from 'api/dtos';

@Component({
    selector: 'app-caja-detail',
    templateUrl: './caja-detail.component.html',
    styleUrls: ['./caja-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaDetailComponent implements OnInit, OnDestroy {
    @Select(CajasState.sucursales) sucursales$: Observable<ISucursalReturnDto[]>;
    cajaForm: FormGroup;
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
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subscribeToActions();
        this._store.dispatch(new GetAllSucursales());
        this.cajaForm = this.createCajaForm();
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
        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionCompleted(Add)).subscribe((result) => {
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
                const message = 'Turno salvado exitosamente.';
                this._toast.success(message, {
                    duration: 4000,
                    position: 'bottom-center',
                });

                if (action instanceof Add) {
                    // we clear the forms
                    this.cajaForm.reset();
                    setTimeout(() => {
                        // we enable the form
                        this.cajaForm.enable();
                        this._store.dispatch(new Navigate(['/caja']));
                    }, 3000);
                }
            }
        });
    }

    /**
     * Create CajaForm
     *
     */
    createCajaForm(): FormGroup {
        return this._formBuilder.group({
            id: [this._route.snapshot.paramMap.get('id')],
            saldoInicial: ['', Validators.required],
            fechaApertura: ['', Validators.required],
            sucursal: ['', Validators.required],
            observaciones: [''],
        });
    }

    /**
     * Save caja
     *
     */
    saveCaja(): void {
        const fechaInicio: Moment = this.cajaForm.get('fechaApertura').value;
        const fechaApertura = fechaInicio.toISOString();
        const caja: CreateCajaDto = { ...this.cajaForm.value, fechaApertura };
        this._store.dispatch(new Add(caja));
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
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearCajasState());
    }
}
