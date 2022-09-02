import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Prisma, TipoDePago, Usuario } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';
import { AuthState } from 'app/core/auth';
import moment from 'moment';
import { Observable, tap } from 'rxjs';

import { CreditosState, ModeCredito, SavePago } from '../_store';

@Component({
    selector: 'app-creditos-pago',
    templateUrl: './creditos-pago.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosPagoComponent implements OnInit {
    loading$!: Observable<boolean>;
    loading: boolean = false;
    selectedCredito$!: Observable<ICreditoReturnDto | undefined>;
    actions$!: Actions;
    tipoDePagoTemp = TipoDePago;
    pagosForm!: UntypedFormGroup;

    currencyInputMask = createMask({
        alias: 'numeric',
        groupSeparator: ',',
        digits: 2,
        digitsOptional: false,
        prefix: '$ ',
        placeholder: '0',
        autoUnmask: true,
    });

    constructor(
        private _store: Store,
        private _actions$: Actions,
        private _toast: HotToastService,
        private _formBuilder: UntypedFormBuilder,
        private _cdr: ChangeDetectorRef
    ) {
        this.loading$ = this._store.select(CreditosState.loading);
        this.actions$ = this._actions$.pipe(
            ofActionCompleted(SavePago),
            tap((result) => {
                const { error, successful } = result.result;
                const { action } = result;
                let message;
                this.loading = false;
                // Mark for check
                this._cdr.markForCheck();
                if (error) {
                    message = `${(error as HttpErrorResponse)['error'].message}`;
                    this._toast.error(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                }
                if (successful) {
                    if (action instanceof SavePago) {
                        message = 'Pago agregado exitosamente.';
                        this._toast.success(message, {
                            duration: 4000,
                            position: 'bottom-center',
                        });

                        this.monto?.reset();
                        this.tipoDePago?.reset();
                        this.observaciones?.reset();
                    }
                }
            })
        );
        this.selectedCredito$ = this._store.select(CreditosState.selectedCredito).pipe(
            tap((credito: ICreditoReturnDto | undefined) => {
                if (credito) {
                    const { saldo, cliente, sucursal } = credito;
                    this.monto?.addValidators(Validators.max(saldo && +saldo > 0 ? +saldo : 0));
                    this.creditoId?.patchValue(credito.id);
                    this.clienteId?.patchValue(cliente.id);
                    this.sucursalId?.patchValue(sucursal.id);
                    this.fechaDePago?.patchValue(moment());
                }
            })
        );
    }

    get monto() {
        return this.pagosForm.get('monto');
    }

    get tipoDePago() {
        return this.pagosForm.get('tipoDePago');
    }

    get creditoId() {
        return this.pagosForm.get('creditoId');
    }

    get clienteId() {
        return this.pagosForm.get('clienteId');
    }

    get sucursalId() {
        return this.pagosForm.get('sucursalId');
    }

    get fechaDePago() {
        return this.pagosForm.get('fechaDePago');
    }

    get observaciones() {
        return this.pagosForm.get('observaciones');
    }

    ngOnInit(): void {
        this.pagosForm = this.createPagosForm();
    }

    /**
     * Create Pagos Form
     *
     */
    createPagosForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [''],
            creditoId: ['', Validators.required],
            clienteId: ['', Validators.required],
            sucursalId: ['', Validators.required],
            monto: [0, [Validators.required, Validators.min(1)]],
            tipoDePago: [null, Validators.required],
            fechaDePago: ['', Validators.required],
            observaciones: [''],
        });
    }

    savePago() {
        const user = this._store.selectSnapshot(AuthState.user) as Usuario;
        const creadoPor = user.nombreUsuario;
        const actualizadoPor = creadoPor;
        const pago: Prisma.PagoCreateInput = {
            monto: Number(this.monto?.value),
            tipoDePago: this.tipoDePago?.value,
            clienteId: this.clienteId?.value,
            sucursalId: this.sucursalId?.value,
            fechaDePago: this.fechaDePago?.value,
            creadoPor,
            actualizadoPor,
            credito: { connect: { id: this.creditoId?.value } },
        };
        console.log(pago);
        this._store.dispatch(new SavePago(pago));
    }

    clearForm() {
        this.monto?.reset();
        this.tipoDePago?.reset();
        this.observaciones?.reset();
    }

    back() {
        this._store.dispatch(new ModeCredito('edit'));
    }
}
