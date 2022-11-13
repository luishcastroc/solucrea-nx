import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Producto, TipoPenalizacion } from '@prisma/client';
import { EditMode } from 'app/core/models';
import {
  AddCredito,
  AjustesCreditosState,
  ClearCreditoState,
  EditCredito,
  SelectCredito,
} from 'app/modules/ajustes/_store';
import { IDays, IFrecuencia } from 'app/modules/ajustes/models';
import { SharedService } from 'app/shared';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { dias } from '../../_config/dias';
import { defaultFrecuencias } from '../../_config/frecuencias';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-details',
  templateUrl: './ajustes-creditos-details.component.html',
  styleUrls: ['./ajustes-creditos-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    InputMaskModule,
    MatInputModule,
    NgIf,
    NgFor,
    TitleCasePipe,
    AsyncPipe,
  ],
})
export class AjustesCreditosDetailsComponent implements OnInit, OnDestroy {
  loading$!: Observable<boolean>;
  loading = false;
  creditosForm!: UntypedFormGroup;
  editMode!: EditMode;
  editMode$!: Observable<EditMode>;
  selectedProducto$!: Observable<Producto | undefined>;
  frecuencias: IFrecuencia[] = defaultFrecuencias;
  days: IDays[] = dias;

  currencyInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: false,
    prefix: '$ ',
    placeholder: '0',
    autoUnmask: true,
  });

  percentageInputMask = createMask({
    alias: 'numeric',
    digits: 2,
    digitsOptional: false,
    suffix: ' %',
    placeholder: '0',
    autoUnmask: true,
  });

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _formBuilder = inject(UntypedFormBuilder);
  private _sharedService = inject(SharedService);
  private _route = inject(ActivatedRoute);
  private _cdr = inject(ChangeDetectorRef);

  constructor() {
    this.loading$ = this._store.select(AjustesCreditosState.loading);
  }

  get id() {
    return this.creditosForm.get('id') as UntypedFormControl;
  }

  get nombre() {
    return this.creditosForm.get('nombre') as UntypedFormControl;
  }

  get descripcion() {
    return this.creditosForm.get('descripcion') as UntypedFormControl;
  }

  get montoMinimo() {
    return this.creditosForm.get('montoMinimo') as UntypedFormControl;
  }

  get montoMaximo() {
    return this.creditosForm.get('montoMaximo') as UntypedFormControl;
  }

  get interes() {
    return this.creditosForm.get('interes') as UntypedFormControl;
  }

  get interesMoratorio() {
    return this.creditosForm.get('interesMoratorio') as UntypedFormControl;
  }

  get tipoPenalizacion() {
    return this.creditosForm.get('tipoPenalizacion') as UntypedFormControl;
  }

  get penalizacion() {
    return this.creditosForm.get('penalizacion') as UntypedFormControl;
  }

  get comision() {
    return this.creditosForm.get('comision') as UntypedFormControl;
  }

  get cargos() {
    return this.creditosForm.get('cargos') as UntypedFormControl;
  }

  get numeroDePagos() {
    return this.creditosForm.get('numeroDePagos') as UntypedFormControl;
  }

  get frecuencia() {
    return this.creditosForm.get('frecuencia') as UntypedFormControl;
  }

  get diaSemana() {
    return this.creditosForm.get('diaSemana') as UntypedFormControl;
  }

  get diaMes() {
    return this.creditosForm.get('diaMes') as UntypedFormControl;
  }

  get creditosActivos() {
    return this.creditosForm.get('creditosActivos') as UntypedFormControl;
  }

  ngOnInit(): void {
    this.creditosForm = this.createCreditosForm();
    this.subscribeToActions();
    this.initializeData(this._route.snapshot.paramMap.get('id'));
  }

  /**
   * Create CreditosForm
   *
   */
  createCreditosForm(): UntypedFormGroup {
    return this._formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      montoMinimo: [0, Validators.required],
      montoMaximo: [0, Validators.required],
      interes: [0, Validators.required],
      interesMoratorio: [0, Validators.required],
      tipoPenalizacion: [TipoPenalizacion.PORCENTAJE, Validators.required],
      penalizacion: [0, Validators.required],
      comision: [0, Validators.required],
      cargos: [0, Validators.required],
      numeroDePagos: [0, Validators.required],
      frecuencia: ['', Validators.required],
      creditosActivos: [0, Validators.required],
      diaSemana: [0],
      diaMes: [0],
    });
  }

  /**
   * Function to subscribe to actions
   *
   *
   */
  subscribeToActions(): void {
    this._actions$
      .pipe(
        ofActionCompleted(AddCredito, EditCredito),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          const { action } = result;
          this.loading = false;
          // Mark for check
          this._cdr.markForCheck();
          if (error) {
            const message = `${(error as HttpErrorResponse)['error'].message}`;
            this._toast.error(message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
          if (successful) {
            let message = 'Producto salvado exitosamente.';
            if (action instanceof EditCredito) {
              message = 'Producto actualizado exitosamente';
            }

            this._toast.success(message, {
              duration: 4000,
              position: 'bottom-center',
            });

            if (action instanceof AddCredito) {
              this.creditosForm.reset();
            } else {
              this.creditosForm.markAsPristine();
            }
          }
          // we enable the form
          this.creditosForm.enable();
        })
      )
      .subscribe();
  }

  /**
   *
   * Initialize the selectors for the mode and colonias
   *
   */
  initializeData(id: string | null): void {
    this.editMode$ = this._store.select(AjustesCreditosState.editMode).pipe(
      tap(edit => {
        this.editMode = edit;

        if (edit === 'edit' && id) {
          this._store.dispatch(new SelectCredito(id));
        }

        this.selectedProducto$ = this._store
          .select(AjustesCreditosState.selectedCredito)
          .pipe(
            tap((credito: Producto | undefined) => {
              if (credito) {
                this.creditosForm.patchValue({
                  ...credito,
                });
              }
            })
          );
      })
    );
  }

  /**
   * Function to save credito into the database
   *
   *
   */
  saveCredito(): void {
    this.loading = true;
    if (this.editMode === 'new') {
      this.creditosForm.disable();
      const diaSemana =
        this.diaSemana.value === '' ? null : this.diaSemana.value;
      const diaMes = this.diaMes.value === '' ? null : this.diaMes.value;
      this._store.dispatch(
        new AddCredito({ ...this.creditosForm.value, diaMes, diaSemana })
      );
    } else if (this.editMode === 'edit') {
      const creditoEdit = this._sharedService.getDirtyValues(this.creditosForm);
      this._store.dispatch(new EditCredito(this.id.value, creditoEdit));
    }
  }

  /**
   * Volver a Creditos
   */
  back(): void {
    this._store.dispatch(new Navigate(['/ajustes/creditos']));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this._store.dispatch(new ClearCreditoState());
  }
}
