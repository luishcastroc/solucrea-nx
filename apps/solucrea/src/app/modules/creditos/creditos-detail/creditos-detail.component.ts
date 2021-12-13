import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetCreditosConfiguration } from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { Producto } from '.prisma/client';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-creditos-detail',
    templateUrl: './creditos-detail.component.html',
    styleUrls: ['./creditos-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosDetailComponent implements OnInit {
    @Select(CreditosState.productos) productos$: Observable<Producto[]>;
    @Select(CreditosState.loading) loading$: Observable<boolean>;
    clienteId: string;
    creditoId: string;
    creditosForm: FormGroup;
    constructor(
        private _store: Store,
        private _actions$: Actions,
        private _toast: HotToastService,
        private location: Location,
        private _route: ActivatedRoute,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this._store.dispatch(new GetCreditosConfiguration());
        this.clienteId = this._route.snapshot.paramMap.get('clienteId');
        this.creditoId = this._route.snapshot.paramMap.get('creditoId');
    }

    /**
     * Volver a Clientes
     */
    back(): void {
        this.location.back();
    }

    /**
     * Initialize Creditos
     *
     * @param clienteId
     * @param creditoId
     */
    initCredito(clienteId: string, creditoId: string): void {}

    /**
     * Create Creditos Form
     *
     */
    createCreditosForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            fechaInicio: ['', Validators.required],
            antiguedad: [null, Validators.required],
            actividadEconomica: ['', Validators.required],
            montoMinimo: [null, Validators.required],
            montoMaximo: [null, Validators.required],
        });
    }
}
