import { HotToastService } from '@ngneat/hot-toast';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Select, Store, Actions } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';
import { CreditosState, ModeCredito } from '../_store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';

@Component({
    selector: 'app-creditos-pago',
    templateUrl: './creditos-pago.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosPagoComponent implements OnInit {
    @Select(CreditosState.selectedCredito)
    selectedCredito$!: Observable<ICreditoReturnDto>;

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
        private _formBuilder: FormBuilder,
        private _cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    /**
     * Create Pagos Form
     *
     */
    createPagosForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            creditoId: ['', Validators.required],
            monto: ['', Validators.required],
            tipoDePago: [null, Validators.required],
            fechaDePago: ['', Validators.required],
            observaciones: [''],
        });
    }

    back() {
        this._store.dispatch(new ModeCredito('edit'));
    }
}
