import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Prisma, TipoDePago, Usuario } from '@prisma/client';
import { ICreditoReturnDto, IUsuarioReturnDto } from 'api/dtos';
import { AuthStateSelectors } from 'app/core/auth';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { DateTime } from 'luxon';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { CreditosSelectors, ModeCredito, SavePago } from '../_store';

@Component({
  selector: 'app-creditos-pago',
  templateUrl: './creditos-pago.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputMaskModule,
    DecimalToNumberPipe,
    CommonModule,
    FuseScrollbarDirective,
  ],
})
export class CreditosPagoComponent implements OnInit, OnDestroy {
  loading$!: Observable<boolean>;
  loading: boolean = false;
  selectedCredito$!: Observable<ICreditoReturnDto | undefined>;
  cobratarios$!: Observable<IUsuarioReturnDto[] | []>;
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

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _formBuilder = inject(UntypedFormBuilder);
  private _cdr = inject(ChangeDetectorRef);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.loading$ = this._store.select(CreditosSelectors.slices.loading);
    this.cobratarios$ = this._store.select(CreditosSelectors.slices.cobratarios);

    this.selectedCredito$ = this._store.select(CreditosSelectors.slices.selectedCredito).pipe(
      tap((credito: ICreditoReturnDto | undefined) => {
        if (credito) {
          const { saldo, cliente, sucursal } = credito;
          this.monto?.addValidators(Validators.max(saldo && +saldo > 0 ? +saldo : 0));
          this.creditoId?.patchValue(credito.id);
          this.clienteId?.patchValue(cliente.id);
          this.sucursalId?.patchValue(sucursal.id);
          this.fechaDePago?.patchValue(DateTime.now());
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

  get cobradorId() {
    return this.pagosForm.get('cobradorId');
  }

  get fechaDePago() {
    return this.pagosForm.get('fechaDePago');
  }

  get observaciones() {
    return this.pagosForm.get('observaciones');
  }

  ngOnInit(): void {
    this.pagosForm = this.createPagosForm();
    this.subsctibeToActions();
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
      cobradorId: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(1)]],
      tipoDePago: [null, Validators.required],
      fechaDePago: ['', Validators.required],
      observaciones: [''],
    });
  }

  savePago() {
    const user = this._store.selectSnapshot(AuthStateSelectors.slices.user) as Usuario;
    const creadoPor = user.nombreUsuario;
    const actualizadoPor = creadoPor;
    const pago: Prisma.PagoCreateInput = {
      monto: Number(this.monto?.value),
      tipoDePago: this.tipoDePago?.value,
      clienteId: this.clienteId?.value,
      sucursal: { connect: { id: this.sucursalId?.value } },
      cobrador: {
        create: { usuario: { connect: { id: this.cobradorId?.value } } },
      },
      fechaDePago: this.fechaDePago?.value,
      creadoPor,
      actualizadoPor,
      credito: { connect: { id: this.creditoId?.value } },
    };
    this._store.dispatch(new SavePago(pago));
  }

  subsctibeToActions() {
    this._actions$
      .pipe(
        ofActionCompleted(SavePago),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          const { action } = result;
          let message;
          this.loading = false;
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
            if (action instanceof SavePago) {
              message = 'Pago agregado exitosamente.';
              this._toast.success(message, {
                duration: 4000,
                position: 'bottom-center',
              });

              this.monto?.reset();
              this.tipoDePago?.reset();
              this.observaciones?.reset();
              this.cobradorId?.reset();
            }
          }
        })
      )
      .subscribe();
  }

  clearForm() {
    this.monto?.reset();
    this.tipoDePago?.reset();
    this.observaciones?.reset();
    this.cobradorId?.reset();
  }

  back() {
    this._store.dispatch(new ModeCredito('edit'));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
