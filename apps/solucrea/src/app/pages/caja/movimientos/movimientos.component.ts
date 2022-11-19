import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  I18nPluralPipe,
  NgFor,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { MovimientoDeCaja } from '@prisma/client';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { Observable } from 'rxjs';

import { CajasState, GetAllMovimientos } from '../_store';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DecimalToNumberPipe,
    CurrencyPipe,
    TitleCasePipe,
    FuseScrollbarModule,
    CurrencyPipe,
    DecimalPipe,
    I18nPluralPipe,
    DatePipe,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MovimientosComponent implements OnInit {
  movimientos$!: Observable<[] | MovimientoDeCaja[]>;
  id: string | null = null;
  private _store = inject(Store);
  private _route = inject(ActivatedRoute);
  constructor() {
    this.movimientos$ = this._store.select(CajasState.movimientos);
    this.id = this._route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this._store.dispatch(new GetAllMovimientos(this.id));
    }
  }

  newMovimiento() {
    this._store.dispatch(new Navigate([`/caja/${this.id}/movimiento`]));
  }
}
