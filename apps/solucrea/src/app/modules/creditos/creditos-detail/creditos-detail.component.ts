import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, Select, Store } from '@ngxs/store';
import { IClienteReturnDto } from 'api/dtos';
import { forkJoin, map, Observable } from 'rxjs';

import { ClearCreditosDetails, GetClienteData, GetCreditosConfiguration } from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { Producto } from '.prisma/client';

@Component({
    selector: 'app-creditos-detail',
    templateUrl: './creditos-detail.component.html',
    styleUrls: ['./creditos-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosDetailComponent implements OnInit, OnDestroy {
    @Select(CreditosState.productos) productos$: Observable<Producto[]>;
    @Select(CreditosState.selectedCliente) selectedCliente$: Observable<IClienteReturnDto>;
    @Select(CreditosState.loading) loading$: Observable<boolean>;

    data$: Observable<{ productos?: Producto[]; cliente?: IClienteReturnDto }>;

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
        this.initCredito(this.clienteId, this.creditoId);
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
    initCredito(clienteId: string, creditoId: string): void {
        if (clienteId) {
            this._store.dispatch(new GetClienteData(clienteId));
            this.data$ = forkJoin([this.productos$, this.selectedCliente$]).pipe(
                map(([productos, cliente]) => ({ productos, cliente }))
            );
        }
    }

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

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCreditosDetails());
    }
}
