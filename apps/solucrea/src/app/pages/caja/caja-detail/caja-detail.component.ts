import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { CreateCajaDto, ICajaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { AddCaja, CajasState, ClearCajasState, EditCaja, GetAllSucursales, SelectCaja } from 'app/pages/caja/_store';
import { SharedService } from 'app/shared';
import { DateTime } from 'luxon';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { checkIfEndDateBeforeStartDate, futureDateValidator } from '../validators/custom-caja.validators';

@Component({
  selector: 'app-caja-detail',
  templateUrl: './caja-detail.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatSelectModule,
    InputMaskModule,
    MatProgressSpinnerModule,
    NgIf,
    AsyncPipe,
    NgFor,
  ],
})
export class CajaDetailComponent implements OnInit, OnDestroy {
  @ViewChild('formDirective') formDirective!: FormGroupDirective;
  sucursales$!: Observable<ISucursalReturnDto[]>;
  editMode$!: Observable<EditMode>;
  selectedCaja$!: Observable<ICajaReturnDto | undefined>;
  loading = false;
  selectedCaja!: ICajaReturnDto;
  editMode!: EditMode;
  cajaForm!: UntypedFormGroup;
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

  private _store = inject(Store);
  private _formBuilder = inject(UntypedFormBuilder);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _route = inject(ActivatedRoute);
  private _shared = inject(SharedService);
  private _cdr = inject(ChangeDetectorRef);

  constructor() {
    this.sucursales$ = this._store.select(CajasState.sucursales);
  }

  get id() {
    return this.cajaForm.controls['id'];
  }

  get saldoInicial() {
    return this.cajaForm.controls['saldoInicial'];
  }

  get fechaApertura() {
    return this.cajaForm.controls['fechaApertura'];
  }

  get sucursal() {
    return this.cajaForm.controls['sucursal'];
  }

  get observaciones() {
    return this.cajaForm.controls['observaciones'];
  }

  get fechaCierre() {
    return this.cajaForm.controls['fechaCierre'];
  }

  get saldoFinal() {
    return this.cajaForm.controls['saldoFinal'];
  }

  get saldoActual() {
    return this.cajaForm.controls['saldoActual'];
  }

  ngOnInit(): void {
    this.subscribeToActions();
    this.initializeData(this._route.snapshot.paramMap.get('id'));
  }

  /**
   *
   * Initialize the selectors for the mode and colonias
   *
   */
  initializeData(id: string | null): void {
    this.editMode$ = this._store.select(CajasState.editMode).pipe(
      tap(edit => {
        this.editMode = edit;

        this._store.dispatch(new GetAllSucursales());
        this.cajaForm = this.createCajaForm(edit);

        if ((edit === 'edit' || edit === 'cierre') && id) {
          this.saldoActual.disable();
          this._store.dispatch(new SelectCaja(id));
        }

        if (edit === 'cierre') {
          this.saldoInicial.disable();
          this.observaciones.disable();
          this.sucursal.disable();
          this.fechaApertura.disable();
        }

        this.selectedCaja$ = this._store.select(CajasState.selectedCaja).pipe(
          tap((caja: ICajaReturnDto | undefined) => {
            if (caja) {
              this.selectedCaja = caja;
              this.cajaForm.patchValue({
                ...caja,
                sucursal: caja.sucursal.id,
              });
            }
          })
        );
      })
    );
  }

  /**
   * Function get back to caja main page
   *
   *
   */
  back() {
    this._store.dispatch(new Navigate(['/caja']));
  }

  /**
   * Function to subscribe to actions
   *
   *
   */
  subscribeToActions(): void {
    this._actions$
      .pipe(
        ofActionCompleted(AddCaja, EditCaja),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          const { action } = result;
          this.loading = false;
          this._cdr.markForCheck();
          if (error) {
            const message = `${(error as HttpErrorResponse)['error'].message}`;
            this._toast.error(message, {
              duration: 4000,
              position: 'bottom-center',
            });
            this.cajaForm.enable();
          }
          if (successful) {
            const message =
              this.editMode === 'new'
                ? 'Turno salvado exitosamente.'
                : this.editMode === 'cierre'
                ? 'Turno cerrado exitosamente.'
                : 'Turno editado exitosamente';
            this._toast.success(message, {
              duration: 4000,
              position: 'bottom-center',
            });

            if (action instanceof AddCaja) {
              this.cajaForm.enable();
              this.cajaForm.reset();
              this.formDirective.resetForm();
            } else if (action instanceof EditCaja && this.editMode === 'cierre') {
              this.saldoFinal.disable();
              this.fechaCierre.disable();
            } else if (action instanceof EditCaja && this.editMode === 'edit') {
              this.cajaForm.enable();
              this.cajaForm.markAsPristine();
            }
          }
        })
      )
      .subscribe();
  }

  /**
   * Create CajaForm
   *
   * @param editMode
   */
  createCajaForm(editMode: EditMode): UntypedFormGroup {
    if (editMode === 'new' || editMode === 'edit') {
      return this._formBuilder.group({
        id: [this._route.snapshot.paramMap.get('id')],
        saldoInicial: [0, Validators.required],
        fechaApertura: ['', Validators.required, futureDateValidator()],
        sucursal: ['', Validators.required],
        observaciones: [''],
        saldoActual: [0],
      });
    } else {
      return this._formBuilder.group(
        {
          id: [this._route.snapshot.paramMap.get('id')],
          saldoInicial: [0, Validators.required],
          fechaApertura: ['', Validators.required, futureDateValidator()],
          sucursal: ['', Validators.required],
          observaciones: [''],
          fechaCierre: ['', Validators.required],
          saldoFinal: [0, Validators.required],
          saldoActual: [0],
        },
        { validators: checkIfEndDateBeforeStartDate() }
      );
    }
  }

  /**
   * Save caja
   *
   * @param editMode
   */
  saveCaja(editMode: EditMode): void {
    this.loading = true;
    this.cajaForm.disable();
    if (editMode === 'new') {
      const fechaApertura = (this.fechaApertura.value as DateTime).toISO();
      const { saldoActual, ...rest } = this.cajaForm.value;
      const caja: CreateCajaDto = {
        ...rest,
        saldoInicial: Number(rest.saldoInicial),
        saldoFinal: Number(rest.saldoFinal),
        fechaApertura,
      };
      this._store.dispatch(new AddCaja(caja));
    } else if (editMode === 'edit') {
      let changedCaja = this._shared.getDirtyValues(this.cajaForm);
      if (changedCaja.fechaInicio) {
        const fechaApertura = (this.fechaApertura.value as DateTime).toISO();
        const { saldoActual, ...rest } = changedCaja;
        changedCaja = { ...rest, fechaApertura };
      }
      this._store.dispatch(new EditCaja(this.id.value, changedCaja));
    } else {
      const fechaCierre = (this.fechaCierre.value as DateTime).toISO();
      this._store.dispatch(
        new EditCaja(this.id.value, {
          fechaCierre,
          saldoFinal: Number(this.saldoFinal.value),
        })
      );
    }
  }

  /**
   * Cancel caja
   *
   * @param editMode
   */
  cancelCaja(editMode: EditMode): void {
    if (editMode === 'new') {
      this.cajaForm.markAsPristine();
      this.cajaForm.reset();
    } else if (editMode === 'edit') {
      this.cajaForm.patchValue({
        ...this.selectedCaja,
        sucursal: this.selectedCaja.sucursal.id,
      });
    } else {
      this.fechaCierre.reset();
      this.saldoFinal.reset();
    }
  }

  /**
   * Go Ajuste
   *
   */
  goAjustes() {
    this._store.dispatch(new Navigate(['/ajustes/sucursales']));
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this._store.dispatch(new ClearCajasState());
  }
}
