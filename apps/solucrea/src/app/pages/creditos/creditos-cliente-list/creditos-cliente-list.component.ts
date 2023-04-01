import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  I18nPluralPipe,
  NgFor,
  NgIf,
  SlicePipe,
} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Status } from '@prisma/client';
import { IClienteReturnDto, ICreditoReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CajasMode } from 'app/pages/caja/_store';
import {
  CreditosState,
  GetAllCreditosCliente,
  GetClienteData,
  GetTurnosCount,
  ModeCredito,
} from 'app/pages/creditos/_store';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { GetCreditosCount } from '../_store/creditos.actions';
import { CreditosSelectors } from '../_store/creditos.selectors';

@Component({
  selector: 'app-creditos-cliente-list',
  templateUrl: './creditos-cliente-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    DecimalToNumberPipe,
    CurrencyPipe,
    DatePipe,
    SlicePipe,
    DecimalPipe,
    I18nPluralPipe,
    NgIf,
    NgFor,
    FuseScrollbarDirective,
  ],
})
export class CreditosClienteListComponent implements OnInit {
  creditos$!: Observable<ICreditoReturnDto[]>;
  cliente$!: Observable<IClienteReturnDto | undefined>;
  creditosCount$!: Observable<number>;
  loading$!: Observable<boolean>;
  turnosCount$!: Observable<number>;

  actions$!: Actions;
  searchInput = new UntypedFormControl();
  values = [
    { display: 'Abiertos', value: Status.ABIERTO },
    { display: 'Cerrados', value: Status.CERRADO },
    { display: 'Suspendidos', value: Status.SUSPENDIDO },
  ];
  status = Status.ABIERTO;
  clienteId!: string | null;
  phoneInputMask = createMask({
    mask: '(999)-999-99-99',
    autoUnmask: true,
  });

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _route = inject(ActivatedRoute);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.creditos$ = this._store.select(CreditosSelectors.slices.creditos);
    this.cliente$ = this._store.select(CreditosSelectors.slices.selectedCliente);
    this.creditosCount$ = this._store.select(CreditosSelectors.slices.creditosCount);
    this.loading$ = this._store.select(CreditosSelectors.slices.loading);
    this.turnosCount$ = this._store.select(CreditosSelectors.slices.turnosCount);
  }

  ngOnInit(): void {
    this.clienteId = this._route.snapshot.paramMap.get('clienteId');
    if (this.clienteId) {
      this._store.dispatch([
        new GetAllCreditosCliente(this.clienteId, Status.ABIERTO),
        new GetTurnosCount(),
        new GetCreditosCount(this.clienteId),
        new GetClienteData(this.clienteId),
      ]);

      this.setActions();
    }
  }

  /**
   * Navigate to a new credito creating a GUID for reference
   *
   *
   */
  openNewCredito(): void {
    this._store.dispatch([
      new Navigate([`creditos/cliente/${this.clienteId}/detail/${AuthUtils.guid()}`]),
      new ModeCredito('new'),
    ]);
  }

  /**
   * Function to set the actions
   *
   *
   */
  setActions(): void {
    this._actions$
      .pipe(
        ofActionCompleted(GetAllCreditosCliente),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          const { action } = result;
          let message;
          if (error) {
            message = `${(error as HttpErrorResponse)['error'].message}`;
            this._toast.error(message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
          if (successful) {
            if (!(action instanceof GetAllCreditosCliente)) {
              this._toast.success(message, {
                duration: 4000,
                position: 'bottom-center',
              });
            }
          }
        })
      )
      .subscribe();
  }

  /**
   *
   * Change filter for Creditos
   */
  changeFilter(e: MatRadioChange) {
    this._store.dispatch(new GetAllCreditosCliente(this.clienteId, e.value));
  }

  /**
   *
   * Go to Credito details
   */
  goToDetails(id: string | undefined) {
    this._store.dispatch([new Navigate([`creditos/cliente/${this.clienteId}/detail/${id}`]), new ModeCredito('edit')]);
  }

  /**
   * new Caja
   *
   */
  newCaja(): void {
    this._store.dispatch([new Navigate([`caja/${AuthUtils.guid()}`]), new CajasMode('new')]);
  }
}
