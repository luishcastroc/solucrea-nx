import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { Store } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { Observable } from 'rxjs';

import { CreditosSelectors, ModeCredito } from '../_store';

@Component({
  selector: 'app-creditos-pagos-list',
  templateUrl: './creditos-pagos-list.component.html',
  styleUrls: ['./creditos-pagos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FuseScrollbarDirective,
    MatButtonModule,
    DecimalToNumberPipe,
    CurrencyPipe,
    DatePipe,
    AsyncPipe,
    NgIf,
    NgFor,
  ],
})
export class CreditosPagosListComponent implements OnInit {
  loading$!: Observable<boolean>;
  loading: boolean = false;
  selectedCredito$!: Observable<ICreditoReturnDto | undefined>;
  private _store = inject(Store);

  constructor() {
    this.loading$ = this._store.select(CreditosSelectors.slices.loading);
    this.selectedCredito$ = this._store.select(CreditosSelectors.slices.selectedCredito);
  }

  ngOnInit(): void {}

  goToDetails(): void {
    this._store.dispatch(new ModeCredito('edit'));
  }
}
