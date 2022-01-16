import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
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
    IUsuarioReturnDto,
} from 'api/dtos';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, takeUntil, tap } from 'rxjs';

import { IDetails, ISegurosData } from '../_models';
import { ICreditoData } from '../_models/credito-data.model';
import { CreditosService } from '../_services/creditos.service';
import {
    ClearCreditosDetails,
    GetClienteData,
    GetClienteWhere,
    GetCreditosConfiguration,
    GetSucursalesWhereCaja,
    SelectCliente,
    SelectClienteReferral,
    SelectParentesco,
    SelectProducto,
    SelectSeguro,
} from '../_store/creditos.actions';
import { CreditosState } from '../_store/creditos.state';
import { SelectModalidadSeguro } from './../_store/creditos.actions';
import { Producto } from '.prisma/client';
import { Moment } from 'moment';

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
    @Select(CreditosState.colocadores) colocadores$: Observable<IUsuarioReturnDto[]>;
    @Select(CreditosState.selectedSeguro) selectedSeguro$: Observable<ISeguroReturnDto>;
    @Select(CreditosState.selectedClienteReferral) selectedClienteReferral$: Observable<IClienteReturnDto>;

    selectedProducto$: Observable<Producto>;
    selectedCliente$: Observable<IClienteReturnDto>;
    selectedOtro$: Observable<boolean>;
    selectedModalidadDeSeguro$: Observable<IModalidadSeguroReturnDto>;

    clienteId: string;
    creditoId: string;
    creditosForm: FormGroup;
    searchInput = new FormControl();
    searchInputReferral = new FormControl();
    selectedCliente: IClienteReturnDto;
    selectedClienteReferral: IClienteReturnDto;
    selectedProducto: Producto;
    selectedModalidadDeSeguro: IModalidadSeguroReturnDto;
    selectedSeguro: ISeguroReturnDto;
    loading = false;
    selectedOtro = false;
    orientation: StepperOrientation = 'horizontal';
    resumenOperacion: IDetails;

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

    get fechaDesembolso() {
        return this.creditosForm.get('fechaDesembolso') as FormControl;
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

    get modalidadDeSeguro() {
        return this.creditosForm.get('modalidadDeSeguro') as FormControl;
    }

    get aval() {
        return this.creditosForm.get('aval') as FormGroup;
    }

    get colocador() {
        return this.creditosForm.get('colocador') as FormControl;
    }

    get observaciones() {
        return this.creditosForm.get('observaciones') as FormControl;
    }

    get referidoPor() {
        return this.creditosForm.get('referidoPor') as FormControl;
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

        this.selectedClienteReferral$.pipe(takeUntil(this._unsubscribeAll)).subscribe((cliente) => {
            if (cliente) {
                this.selectedClienteReferral = cliente;
                this.colocador.setValue(cliente.id);
                this.colocador.markAsTouched();
            }
        });

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

        this.selectedSeguro$.pipe(takeUntil(this._unsubscribeAll)).subscribe((seguro: ISeguroReturnDto) => {
            if (seguro) {
                this.selectedSeguro = seguro;
            }
            // Mark for check
            this._cdr.markForCheck();
        });

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
                    debounceTime(500),
                    distinctUntilChanged(),
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

        this.searchInputReferral.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                filter((search) => !!search),
                tap((search) => {
                    if (typeof search === 'string') {
                        this._store.dispatch(new GetClienteWhere(search));
                    } else {
                        this.loading = true;
                        this._store.dispatch(new SelectClienteReferral(search));
                    }
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe();
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
    changeFechaDesembolso(e): void {
        this.fechaInicio.setValue(this._creditosService.addBusinessDays(this.fechaDesembolso.value, 1));
        this.fechaFinal.setValue(
            this._creditosService.addBusinessDays(this.fechaInicio.value, this.selectedProducto.duracion)
        );
        this.fechaInicio.markAsTouched();
        this.fechaFinal.markAsTouched();
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
     * Select Seguro
     *
     * @param producto
     */
    selectSeguro(id: string): void {
        //Assign to local variable
        this._store.dispatch(new SelectSeguro(id));
    }

    /**
     * Create Creditos Form
     *
     */
    createCreditosForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            fechaDesembolso: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFinal: [null, Validators.required],
            monto: ['', Validators.required],
            cliente: [null, Validators.required],
            sucursal: [null, Validators.required],
            producto: [null, Validators.required],
            seguro: [null],
            colocador: [null, Validators.required],
            modalidadDeSeguro: [null, Validators.required],
            observaciones: [''],
            referidoPor: ['', Validators.required],
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

    /**
     * selection change for stepper
     *
     */
    selectionChange(event: StepperSelectionEvent) {
        const stepLabel = event.selectedStep.label;
        if (stepLabel === 'Resumen de la Operación') {
            const modalidadDeSeguro = this.selectedModalidadDeSeguro.titulo;
            const data: ICreditoData = {
                monto: this.monto.value,
                interesMoratorio: Number(this.selectedProducto.interesMoratorio),
                tasaInteres: Number(this.selectedProducto.interes),
                cargos: Number(this.selectedProducto.cargos),
                comisionPorApertura: Number(this.selectedProducto.comision),
                numeroDePagos: Number(this.selectedProducto.numeroDePagos),
                montoSeguro: Number(this.selectedSeguro ? this.selectedSeguro.monto : 0),
                modalidadSeguro: modalidadDeSeguro.includes('Diferido')
                    ? 'diferido'
                    : modalidadDeSeguro.includes('Contado')
                    ? 'contado'
                    : 'sin seguro',
            };

            this.resumenOperacion = this._creditosService.calculateDetails(data);
            console.log(this.resumenOperacion);
        }
    }

    /**
     * Filter to cancel sundays
     *
     * @param date
     */
    myFilter(d: Moment | null): boolean {
        const day = d?.weekday();
        // Prevent Sunday from being selected.
        return day !== 0;
    }

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCreditosDetails());
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
