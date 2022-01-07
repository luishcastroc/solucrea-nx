import { StepperOrientation } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import {
    IClienteReturnDto,
    IModalidadSeguroReturnDto,
    IParentescoReturnDto,
    ISeguroReturnDto,
    ISucursalReturnDto,
} from 'api/dtos';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, takeUntil, tap } from 'rxjs';

import { ISegurosData } from '../_models';
import {
    ClearCreditosDetails,
    GetClienteData,
    GetClienteWhere,
    GetCreditosConfiguration,
    GetSucursalesWhereCaja,
    SelectCliente,
    SelectParentesco,
    SelectProducto,
} from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { SelectModalidadSeguro } from './../_store/creditos.actions';
import { Producto } from '.prisma/client';
import { CreditosService } from '../_services/creditos.service';

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
    @Select(CreditosState.sucursales) sucursales$: Observable<ISucursalReturnDto[]>;
    @Select(CreditosState.parentescos) parentescos$: Observable<IParentescoReturnDto[]>;
    @Select(CreditosState.segurosData) segurosData$: Observable<ISegurosData>;

    selectedProducto$: Observable<Producto>;
    selectedCliente$: Observable<IClienteReturnDto>;
    selectedOtro$: Observable<boolean>;
    selectedModalidadDeSeguro$: Observable<IModalidadSeguroReturnDto>;
    selectedSeguro$: Observable<ISeguroReturnDto>;

    clienteId: string;
    creditoId: string;
    creditosForm: FormGroup;
    searchInput = new FormControl();
    selectedCliente: IClienteReturnDto;
    selectedProducto: Producto;
    selectedModalidadDeSeguro: IModalidadSeguroReturnDto;
    selectedSeguro: ISeguroReturnDto;
    loading = false;
    selectedOtro = false;
    orientation: StepperOrientation = 'horizontal';

    phoneInputMask = createMask({
        mask: '(999)-999-99-99',
        autoUnmask: true,
    });

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
        private _actions$: Actions,
        private _toast: HotToastService,
        private location: Location,
        private _route: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _cdr: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _creditosService: CreditosService
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
        return this.creditosForm.get('aval') as FormGroup;
    }

    ngOnInit(): void {
        this._store.dispatch(new GetCreditosConfiguration());
        this.clienteId = this._route.snapshot.paramMap.get('clienteId');
        this.creditoId = this._route.snapshot.paramMap.get('creditoId');
        this.initCredito(this.clienteId, this.creditoId);

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('md')) {
                    this.orientation = 'horizontal';
                } else {
                    this.orientation = 'vertical';
                }

                // Mark for check
                this._cdr.markForCheck();
            });
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
                if (cliente) {
                    this.selectedCliente = cliente;
                    this.cliente.setValue(cliente.id);
                }
            })
        );

        this.selectedProducto$ = this._store.select(CreditosState.selectedProducto).pipe(
            tap((producto: Producto) => {
                if (producto) {
                    this.selectedProducto = producto;
                    this.producto.setValue(producto.id);
                    this.monto.setValidators([
                        Validators.required,
                        Validators.min(Number(producto.montoMinimo)),
                        Validators.max(Number(producto.montoMaximo)),
                    ]);
                    this._store.dispatch(
                        new GetSucursalesWhereCaja(Number(producto.montoMinimo), Number(producto.montoMaximo))
                    );
                }
            })
        );

        this.selectedModalidadDeSeguro$ = this._store.select(CreditosState.selectedModalidadDeSeguro).pipe(
            tap((modalidad: IModalidadSeguroReturnDto) => {
                if (modalidad) {
                    this.seguro.enable();
                    this.seguro.setValidators(Validators.required);
                    this.selectedModalidadDeSeguro = modalidad;
                } else {
                    this.seguro.disable();
                    this.seguro.setValidators([]);
                }

                // Mark for check
                this._cdr.markForCheck();
            })
        );

        this.selectedSeguro$ = this._store.select(CreditosState.selectedSeguro).pipe(
            tap((seguro: ISeguroReturnDto) => {
                if (seguro) {
                    this.selectedSeguro = seguro;
                }
                // Mark for check
                this._cdr.markForCheck();
            })
        );

        this.selectedOtro$ = this._store.select(CreditosState.selectedOtro).pipe(
            tap((result) => {
                if (result) {
                    this.aval.get('otro').setValidators(Validators.required);
                } else {
                    this.aval.get('otro').setValidators([]);
                }

                // Mark for check
                this._cdr.markForCheck();
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
    selectProducto(id: string): void {
        //Assign to local variable
        this._store.dispatch(new SelectProducto(id));
    }

    /**
     *
     * @param event
     */
    changeFechaInicio(e): void {
        this.fechaFinal.setValue(
            this._creditosService.addBusinessDays(this.fechaInicio.value, this.selectedProducto.duracion)
        );
    }

    /**
     * Select Modalidad de Seguro
     *
     * @param producto
     */
    selectModalidadDeSeguro(id: string): void {
        //Assign to local variable
        this._store.dispatch(new SelectModalidadSeguro(id));
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
     *
     * Cancel Credito
     *
     */
    cancelCredito(): void {
        this.creditosForm.reset();
        if (!this.clienteId) {
            this._store.dispatch(new SelectCliente(null));
            this.searchInput.setValue('');
        }
        this._store.dispatch(new SelectProducto(null));
        this._cdr.detectChanges();
    }

    /**
     *
     * @param parentesco
     *
     */
    checkParentesco(id: string): void {
        this._store.dispatch(new SelectParentesco(id));
    }

    /**
     * Display Function to return the client value
     *
     */
    displayFn(cliente: IClienteReturnDto): string {
        return cliente ? `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}` : '';
    }

    /**
     * desembolsar el credito
     *
     */
    desembolsar(): void {
        console.log(this._creditosService.prepareCreditoRecord(this.creditosForm));
    }

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCreditosDetails());
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
