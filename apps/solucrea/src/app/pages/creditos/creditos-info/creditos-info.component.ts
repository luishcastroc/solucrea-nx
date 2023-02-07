import { AsyncPipe, CurrencyPipe, DatePipe, Location, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { Store } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { Observable } from 'rxjs';

import { CreditosState, GetCobratarios, ModeCredito, SelectCredito } from '../_store';

@Component({
  selector: 'app-creditos-info',
  templateUrl: './creditos-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SlicePipe,
    AsyncPipe,
    CurrencyPipe,
    DecimalToNumberPipe,
    DatePipe,
    NgIf,
    NgFor,
    FuseScrollbarDirective,
  ],
})
export class CreditosInfoComponent implements OnInit {
  loading$!: Observable<boolean>;
  selectedCredito$!: Observable<ICreditoReturnDto | undefined>;
  creditoId!: string | null;

  private _store = inject(Store);
  private location = inject(Location);
  private _route = inject(ActivatedRoute);

  constructor() {
    this.loading$ = this._store.select(CreditosState.loading);
    this.selectedCredito$ = this._store.select(CreditosState.selectedCredito);
  }

  ngOnInit(): void {
    this.creditoId = this._route.snapshot.paramMap.get('creditoId');
    if (this.creditoId) {
      this._store.dispatch([new SelectCredito(this.creditoId), new GetCobratarios()]);
    }
  }

  /**
   * Volver a Clientes
   */
  back(): void {
    this.location.back();
  }

  goToPago() {
    this._store.dispatch(new ModeCredito('pago'));
  }

  goToPagosList() {
    this._store.dispatch(new ModeCredito('pagos-list'));
  }
}
