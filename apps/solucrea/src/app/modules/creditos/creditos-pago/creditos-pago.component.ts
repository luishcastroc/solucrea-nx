import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Actions, Select, Store } from '@ngxs/store';
import { Prisma, TipoDePago, Usuario } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';
import { AuthState, AuthStateModel } from 'app/core/auth';
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
    @Select(CreditosState.loading)
    loading$!: Observable<boolean>;
    selectedCredito$!: Observable<ICreditoReturnDto | undefined>;
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
        const creadoPor = user.nombre;
        const pago: Prisma.PagoCreateInput = {
            monto: Number(this.monto?.value),
            tipoDePago: this.tipoDePago?.value,
            clienteId: this.clienteId?.value,
            sucursalId: this.sucursalId?.value,
            fechaDePago: this.fechaDePago?.value,
            creadoPor,
            credito: { connect: { id: this.creditoId?.value } },
        };
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
