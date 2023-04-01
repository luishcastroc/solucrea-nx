import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, I18nPluralPipe, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Status } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth';
import { CajasMode } from 'app/pages/caja/_store';
import { ClientesMode } from 'app/pages/clientes/_store';
import {
  CreditosState,
  GetAllCreditos,
  GetClientesCount,
  GetTurnosCount,
  ModeCredito,
} from 'app/pages/creditos/_store';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { GetCreditosCount } from '../_store/creditos.actions';
import { CreditosSelectors } from '../_store/creditos.selectors';

@Component({
  selector: 'app-creditos-list',
  templateUrl: './creditos-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgFor,
    DecimalToNumberPipe,
    CurrencyPipe,
    I18nPluralPipe,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    FuseScrollbarDirective,
  ],
})
export class CreditosListComponent implements OnInit, OnDestroy {
  creditos$!: Observable<ICreditoReturnDto[]>;
  loading$!: Observable<boolean>;
  clientesCount$!: Observable<number>;
  creditosCount$!: Observable<number>;
  turnosCount$!: Observable<number>;

  searchInput = new UntypedFormControl();
  values = [
    { display: 'Abiertos', value: Status.ABIERTO },
    { display: 'Cerrados', value: Status.CERRADO },
    { display: 'Suspendidos', value: Status.SUSPENDIDO },
  ];
  status = Status.ABIERTO;

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.creditos$ = this._store.select(CreditosSelectors.slices.creditos);
    this.loading$ = this._store.select(CreditosSelectors.slices.loading);
    this.clientesCount$ = this._store.select(CreditosSelectors.slices.clientesCount);
    this.creditosCount$ = this._store.select(CreditosSelectors.slices.creditosCount);
    this.turnosCount$ = this._store.select(CreditosSelectors.slices.turnosCount);
  }

  ngOnInit(): void {
    this._store.dispatch([
      new GetAllCreditos(Status.ABIERTO),
      new GetClientesCount(),
      new GetTurnosCount(),
      new GetCreditosCount(null),
    ]);

    this.setActions();
  }

  /**
   * Navigate to a new credito creating a GUID for reference
   *
   *
   */
  openNewCredito(): void {
    this._store.dispatch([new Navigate([`creditos/${AuthUtils.guid()}`]), new ModeCredito('new')]);
  }

  /**
   * Function to set the actions
   *
   *
   */
  setActions(): void {
    this._actions$
      .pipe(
        ofActionCompleted(GetAllCreditos),
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
            if (!(action instanceof GetAllCreditos)) {
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
    this._store.dispatch(new GetAllCreditos(e.value));
  }

  /**
   *
   * Go to Credito details
   */
  goToDetails(id: string | undefined) {
    this._store.dispatch([new Navigate([`creditos/${id}`]), new ModeCredito('edit')]);
  }

  /**
   *
   * function to generate a new Cliente
   */
  newCliente() {
    this._store.dispatch([new Navigate([`clientes/${AuthUtils.guid()}`]), new ClientesMode('new')]);
  }

  /**
   * new Caja
   *
   */
  newCaja(): void {
    this._store.dispatch([new Navigate([`caja/${AuthUtils.guid()}`]), new CajasMode('new')]);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
