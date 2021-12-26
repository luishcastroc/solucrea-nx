import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { IClienteReturnDto } from 'api/dtos';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, takeUntil, tap } from 'rxjs';

import {
    ClearCreditosDetails,
    GetClienteData,
    GetClienteWhere,
    GetCreditosConfiguration,
    SelectCliente,
} from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { Producto } from '.prisma/client';

@Component({
    selector: 'app-creditos-detail',
    templateUrl: './creditos-detail.component.html',
    styleUrls: ['./creditos-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosDetailComponent implements OnInit, OnDestroy {
    @Select(CreditosState.loading) loading$: Observable<boolean>;
    @Select(CreditosState.clientes) clientes$: Observable<IClienteReturnDto[]>;
    @Select(CreditosState.productos) productos$: Observable<Producto[]>;

    selectedCliente$: Observable<IClienteReturnDto>;

    clienteId: string;
    creditoId: string;
    creditosForm: FormGroup;
    searchInput = new FormControl();
    selectedCliente: IClienteReturnDto;
    selectedProducto: Producto;
    loading = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _actions$: Actions,
        private _toast: HotToastService,
        private location: Location,
        private _route: ActivatedRoute,
        private _formBuilder: FormBuilder
    ) {}

    get id() {
        return this.creditosForm.get('id') as FormControl;
    }

    get fechaInicio() {
        return this.creditosForm.get('fechaInicio') as FormControl;
    }

    get fechaFinal() {
        return this.creditosForm.get('fechaFinal') as FormControl;
    }

    get monto() {
        return this.creditosForm.get('monto') as FormControl;
    }

    get status() {
        return this.creditosForm.get('status') as FormControl;
    }

    get cliente() {
        return this.creditosForm.get('cliente') as FormControl;
    }

    get sucursal() {
        return this.creditosForm.get('sucursal') as FormControl;
    }

    get producto() {
        return this.creditosForm.get('producto') as FormControl;
    }

    get seguro() {
        return this.creditosForm.get('seguro') as FormControl;
    }

    get modalidadSeguro() {
        return this.creditosForm.get('modalidadSeguro') as FormControl;
    }

    get aval() {
        return this.creditosForm.get('aval') as FormControl;
    }

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
        this.creditosForm = this.createCreditosForm();
        this.selectedCliente$ = this._store.select(CreditosState.selectedCliente).pipe(
            tap((cliente) => {
                this.selectedCliente = cliente;
            })
        );

        this._actions$.pipe(ofActionCompleted(SelectCliente), takeUntil(this._unsubscribeAll)).subscribe((result) => {
            const { error, successful } = result.result;
            const { action } = result;
            this.loading = false;
            if (error) {
                const message = `${error['error'].message}`;
                this._toast.error(message, {
                    duration: 4000,
                    position: 'bottom-center',
                });
            }
            // if (successful) {
            //     if (action instanceof SelectCliente) {
            //         this.loading = false;
            //     }
            //     // this._toast.success(message, {
            //     //     duration: 4000,
            //     //     position: 'bottom-center',
            //     // });
            // }
        });

        if (clienteId) {
            this._store.dispatch(new GetClienteData(clienteId));
        } else {
            this.searchInput.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    debounceTime(500),
                    filter((search) => !!search),
                    tap((search) => {
                        if (typeof search === 'string') {
                            this._store.dispatch(new GetClienteWhere(search));
                        } else {
                            this.loading = true;
                            this._store.dispatch(new SelectCliente(search));
                        }
                    }),
                    takeUntil(this._unsubscribeAll)
                )
                .subscribe();
        }
    }

    /**
     * Select Producto
     *
     * @param producto
     */
    selectProducto(producto: Producto): void {
        console.log(producto);
        this.selectedProducto = producto;
    }

    /**
     * Create Creditos Form
     *
     */
    createCreditosForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            fechaInicio: ['', Validators.required],
            fechaFinal: [null, Validators.required],
            monto: ['', Validators.required],
            status: [null, Validators.required],
            cliente: [null, Validators.required],
            sucursal: [null, Validators.required],
            producto: [null, Validators.required],
            seguro: [null],
            modalidadSeguro: [null, Validators.required],
            aval: this._formBuilder.group({
                id: [''],
                nombre: ['', Validators.required],
                apellidoPaterno: ['', Validators.required],
                apellidoMaterno: ['', Validators.required],
                telefono: ['', Validators.required],
                fechaDeNacimiento: ['', Validators.required],
                parentesco: ['', Validators.required],
                otro: [''],
                ocupacion: ['', Validators.required],
            }),
        });
    }

    /**
     * Display Function to return the client value
     *
     */
    displayFn(cliente: IClienteReturnDto): string {
        return cliente ? `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}` : '';
    }

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCreditosDetails());
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
