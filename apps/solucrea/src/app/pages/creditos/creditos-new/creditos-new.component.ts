import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  Location,
  NgFor,
  NgIf,
  PercentPipe,
  TitleCasePipe,
} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Producto } from '@prisma/client';
import {
  addBusinessDays,
  calculateDetails,
  getFrecuencia,
  ICreditoData,
  IDetails,
  ISegurosData,
} from '@solucrea-utils';
import {
  IClienteReturnDto,
  IModalidadSeguroReturnDto,
  IParentescoReturnDto,
  ISeguroReturnDto,
  ISucursalReturnDto,
  IUsuarioReturnDto,
} from 'api/dtos';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { DateTime } from 'luxon';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, takeUntil, tap } from 'rxjs';

import { CreditosService } from '../_services/creditos.service';
import {
  ClearCreditosDetails,
  CreateCredito,
  CreditosSelectors,
  GetClienteData,
  GetClienteWhere,
  GetCreditosConfiguration,
  GetSucursalesWhereCaja,
  SelectCliente,
  SelectClienteReferral,
  SelectModalidadSeguro,
  SelectParentesco,
  SelectProducto,
  SelectSeguro,
} from '../_store';

@Component({
  selector: 'app-creditos-new',
  templateUrl: './creditos-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatStepperModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatLuxonDateModule,
    InputMaskModule,
    NgIf,
    AsyncPipe,
    PercentPipe,
    CurrencyPipe,
    TitleCasePipe,
    DecimalPipe,
    NgFor,
    DecimalToNumberPipe,
  ],
})
export class CreditosNewComponent implements OnInit, OnDestroy {
  @Input()
  clienteId!: string | null;
  @ViewChild('stepper')
  private myStepper!: MatStepper;

  loading$!: Observable<boolean>;
  clientes$!: Observable<IClienteReturnDto[]>;
  productos$!: Observable<Producto[]>;
  sucursales$!: Observable<ISucursalReturnDto[]>;
  parentescos$!: Observable<IParentescoReturnDto[]>;
  segurosData$!: Observable<ISegurosData | undefined>;
  colocadores$!: Observable<IUsuarioReturnDto[]>;
  selectedSeguro$!: Observable<ISeguroReturnDto | undefined>;
  selectedClienteReferral$!: Observable<IClienteReturnDto | undefined>;

  selectedProducto$!: Observable<Producto | undefined>;
  selectedCliente$!: Observable<IClienteReturnDto | undefined>;
  selectedOtro$!: Observable<boolean>;
  selectedModalidadDeSeguro$!: Observable<IModalidadSeguroReturnDto | undefined>;

  creditoId!: string | null;
  creditosForm!: UntypedFormGroup;
  searchInput = new UntypedFormControl();
  searchInputReferral = new UntypedFormControl();
  selectedCliente!: IClienteReturnDto;
  selectedClienteReferral!: IClienteReturnDto;
  selectedProducto!: Producto;
  selectedModalidadDeSeguro!: IModalidadSeguroReturnDto | undefined;
  selectedSeguro!: ISeguroReturnDto;
  loading = false;
  selectedOtro = false;
  orientation: StepperOrientation = 'horizontal';
  resumenOperacion!: IDetails;

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

  titleInputMask = createMask({ casing: 'title' });

  desembolsando = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _store: Store,
    private _actions$: Actions,
    private _toast: HotToastService,
    private location: Location,
    private _formBuilder: UntypedFormBuilder,
    private _cdr: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _creditosService: CreditosService
  ) {
    this.loading$ = this._store.select(CreditosSelectors.slices.loading);
    this.clientes$ = this._store.select(CreditosSelectors.slices.clientes);
    this.productos$ = this._store.select(CreditosSelectors.slices.productos);
    this.sucursales$ = this._store.select(CreditosSelectors.slices.sucursales);
    this.parentescos$ = this._store.select(CreditosSelectors.slices.parentescos);
    this.segurosData$ = this._store.select(CreditosSelectors.slices.segurosData);
    this.colocadores$ = this._store.select(CreditosSelectors.slices.colocadores);
    this.selectedSeguro$ = this._store.select(CreditosSelectors.slices.selectedSeguro);
    this.selectedClienteReferral$ = this._store.select(CreditosSelectors.slices.selectedClienteReferral);
  }

  get id() {
    return this.creditosForm.get('id') as UntypedFormControl;
  }

  get fechaInicio() {
    return this.creditosForm.get('fechaInicio') as UntypedFormControl;
  }

  get fechaDesembolso() {
    return this.creditosForm.get('fechaDesembolso') as UntypedFormControl;
  }

  get fechaFinal() {
    return this.creditosForm.get('fechaFinal') as UntypedFormControl;
  }

  get monto() {
    return this.creditosForm.get('monto') as UntypedFormControl;
  }

  get cuota() {
    return this.creditosForm.get('cuota') as UntypedFormControl;
  }

  get cuotaCapital() {
    return this.creditosForm.get('cuotaCapital') as UntypedFormControl;
  }

  get cuotaInteres() {
    return this.creditosForm.get('cuotaInteres') as UntypedFormControl;
  }

  get cuotaSeguro() {
    return this.creditosForm.get('cuotaSeguro') as UntypedFormControl;
  }

  get cuotaMora() {
    return this.creditosForm.get('cuotaMora') as UntypedFormControl;
  }

  get status() {
    return this.creditosForm.get('status') as UntypedFormControl;
  }

  get cliente() {
    return this.creditosForm.get('cliente') as UntypedFormControl;
  }

  get sucursal() {
    return this.creditosForm.get('sucursal') as UntypedFormControl;
  }

  get producto() {
    return this.creditosForm.get('producto') as UntypedFormControl;
  }

  get seguro() {
    return this.creditosForm.get('seguro') as UntypedFormControl;
  }

  get modalidadDeSeguro() {
    return this.creditosForm.get('modalidadDeSeguro') as UntypedFormControl;
  }

  get aval() {
    return this.creditosForm.get('aval') as UntypedFormGroup;
  }

  get colocador() {
    return this.creditosForm.get('colocador') as UntypedFormControl;
  }

  get observaciones() {
    return this.creditosForm.get('observaciones') as UntypedFormControl;
  }

  get referidoPor() {
    return this.creditosForm.get('referidoPor') as UntypedFormControl;
  }

  ngOnInit(): void {
    this._store.dispatch(new GetCreditosConfiguration());
    this.initCredito(this.clienteId);

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
   *
   */
  initCredito(clienteId: string | null): void {
    this.creditosForm = this.createCreditosForm();

    this.selectedCliente$ = this._store.select(CreditosSelectors.slices.selectedCliente).pipe(
      tap((cliente: IClienteReturnDto | undefined) => {
        if (cliente) {
          this.selectedCliente = cliente;
          this.cliente.setValue(cliente.id);
        }
      })
    );

    this.selectedClienteReferral$.pipe(takeUntil(this._unsubscribeAll)).subscribe(cliente => {
      if (cliente) {
        this.selectedClienteReferral = cliente;
        this.colocador.setValue(cliente.id);
        this.colocador.markAsTouched();
      }
    });

    this.selectedProducto$ = this._store.select(CreditosSelectors.slices.selectedProducto).pipe(
      tap((producto: Producto | undefined) => {
        if (producto) {
          this.selectedProducto = producto;
          this.producto.setValue(producto.id);
          this.monto.setValidators([
            Validators.required,
            Validators.min(Number(producto.montoMinimo)),
            Validators.max(Number(producto.montoMaximo)),
          ]);
          this._store.dispatch(new GetSucursalesWhereCaja(Number(producto.montoMinimo), Number(producto.montoMaximo)));
        }
      })
    );

    this.selectedModalidadDeSeguro$ = this._store.select(CreditosSelectors.slices.selectedModalidadDeSeguro).pipe(
      tap((modalidad: IModalidadSeguroReturnDto | undefined) => {
        this.selectedModalidadDeSeguro = modalidad;
        if (modalidad?.titulo !== 'Sin Seguro') {
          this.seguro.enable();
          this.seguro.setValidators(Validators.required);
        } else {
          this.seguro.disable();
          this.seguro.setValidators([]);
        }

        // Mark for check
        this._cdr.markForCheck();
      })
    );

    this.selectedSeguro$.pipe(takeUntil(this._unsubscribeAll)).subscribe((seguro: ISeguroReturnDto | undefined) => {
      if (seguro) {
        this.selectedSeguro = seguro;
      }
      // Mark for check
      this._cdr.markForCheck();
    });

    this.selectedOtro$ = this._store.select(CreditosSelectors.slices.selectedOtro).pipe(
      tap(result => {
        if (result) {
          this.aval.get('otro')?.setValidators(Validators.required);
        } else {
          this.aval.get('otro')?.setValidators([]);
        }

        // Mark for check
        this._cdr.markForCheck();
      })
    );

    this._actions$
      .pipe(
        ofActionCompleted(SelectCliente, CreateCredito, SelectProducto),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          const { action } = result;
          let message;
          this.loading = false;
          this.desembolsando = false;
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
            if (action instanceof CreateCredito) {
              message = 'Crédito agregado exitosamente.';
              this._toast.success(message, {
                duration: 4000,
                position: 'bottom-center',
              });

              this.creditosForm.reset();
              this.creditosForm.enable();
              this.searchInput.reset();
              // we reset the stepper
              this.myStepper.reset();
              if (!this.clienteId) {
                this._store.dispatch(new SelectCliente(undefined));
                this.searchInput.setValue('');
              }
              this._store.dispatch(new SelectProducto(null, null));
            }
          }
        })
      )
      .subscribe();

    if (clienteId) {
      this._store.dispatch(new GetClienteData(clienteId));
    } else {
      this.searchInput.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          filter(search => !!search),
          tap(search => {
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
        filter(search => !!search),
        tap(search => {
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
    this._store.dispatch(new SelectProducto(this.selectedCliente.id, id));
  }

  /**
   *
   * @param event
   */
  changeFechaDesembolso(e: any): void {
    const frecuencia = getFrecuencia(this.selectedProducto.frecuencia);
    const duracion = frecuencia * this.selectedProducto.numeroDePagos;
    this.fechaInicio.setValue(addBusinessDays(this.fechaDesembolso.value, 1));
    if (this.fechaInicio.valid) {
      this.fechaFinal.setValue(addBusinessDays(this.fechaInicio.value, duracion));
    }
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
  createCreditosForm(): UntypedFormGroup {
    return this._formBuilder.group({
      id: [''],
      fechaDesembolso: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: [null, Validators.required],
      monto: [0, Validators.required],
      cuota: [0],
      cuotaCapital: [0],
      cuotaInteres: [0],
      cuotaSeguro: [0],
      cuotaMora: [0],
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
      this._store.dispatch(new SelectCliente(undefined));
      this.searchInput.setValue('');
    }
    this._store.dispatch(new SelectProducto(null, null));
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
    const creditosData = this._creditosService.prepareCreditoRecord(this.creditosForm);
    this.creditosForm.disable();
    this.desembolsando = true;
    this._store.dispatch(new CreateCredito(creditosData));
  }

  /**
   * selection change for stepper
   *
   */
  selectionChange(event: StepperSelectionEvent) {
    const stepLabel = event.selectedStep.label;
    if (stepLabel === 'Resumen de la Operación') {
      const modalidadDeSeguro = this.selectedModalidadDeSeguro?.titulo;
      const data: ICreditoData = {
        monto: Number(this.monto.value),
        interesMoratorio: Number(this.selectedProducto.interesMoratorio),
        tasaInteres: Number(this.selectedProducto.interes),
        cargos: Number(this.selectedProducto.cargos),
        comisionPorApertura: Number(this.selectedProducto.comision),
        numeroDePagos: Number(this.selectedProducto.numeroDePagos),
        montoSeguro: Number(this.selectedSeguro ? this.selectedSeguro.monto : 0),
        modalidadSeguro: modalidadDeSeguro?.includes('Diferido')
          ? 'diferido'
          : modalidadDeSeguro?.includes('Contado')
          ? 'contado'
          : 'sin seguro',
      };

      this.resumenOperacion = calculateDetails(data);
      this.cuota.setValue(this.resumenOperacion.cuota);
      this.cuotaCapital.setValue(this.resumenOperacion.capital);
      this.cuotaInteres.setValue(this.resumenOperacion.interes);
      this.cuotaMora.setValue(this.resumenOperacion.mora);
      this.cuotaSeguro.setValue(modalidadDeSeguro?.includes('Diferido') ? this.resumenOperacion.seguro : 0);
    }
  }

  /**
   * Filter to cancel sundays
   *
   * @param date
   */
  myFilter(d: DateTime | null): boolean {
    const day = d?.weekday;
    // Prevent Sunday from being selected.
    return day !== 7;
  }

  ngOnDestroy(): void {
    this._store.dispatch(new ClearCreditosDetails());
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
