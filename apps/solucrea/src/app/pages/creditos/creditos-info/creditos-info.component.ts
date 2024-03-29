import { CommonModule, CurrencyPipe, Location } from '@angular/common';
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

import { GetCobratarios, ModeCredito, SelectCredito } from '../_store';
import { CreditosSelectors } from '../_store/creditos.selectors';

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
    CurrencyPipe,
    DecimalToNumberPipe,
    CommonModule,
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
    this.loading$ = this._store.select(CreditosSelectors.slices.loading);
    this.selectedCredito$ = this._store.select(CreditosSelectors.slices.selectedCredito);
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
