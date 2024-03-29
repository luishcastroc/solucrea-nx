import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ICajaReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CajaSelectors, CajasMode, GetAll } from 'app/pages/caja/_store';
import { DecimalToNumberPipe } from 'app/shared/pipes/decimalnumber.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-caja-list',
  templateUrl: './caja-list.component.html',
  styleUrls: ['./caja-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DecimalToNumberPipe,
    CurrencyPipe,
    DatePipe,
    AsyncPipe,
    NgFor,
    NgIf,
  ],
})
export class CajaListComponent implements OnInit {
  cajas$!: Observable<ICajaReturnDto[]>;
  private _store = inject(Store);

  constructor() {
    this.cajas$ = this._store.select(CajaSelectors.slices.cajas);
  }

  ngOnInit(): void {
    this._store.dispatch(new GetAll());
  }

  /**
   * new Caja
   *
   */
  newCaja(): void {
    this._store.dispatch([new Navigate([`caja/${AuthUtils.guid()}`]), new CajasMode('new')]);
  }

  /**
   * Function to navigate to movimientos
   *
   * @param id CajaId
   */
  goToMovimientos(id: string): void {
    this._store.dispatch(new Navigate([`caja/${id}/movimientos`]));
  }

  /**
   *
   * Function to edit Caja
   *
   * @param id string
   */
  editCaja(id: string): void {
    this._store.dispatch([new Navigate([`caja/${id}`]), new CajasMode('edit')]);
  }

  /**
   *
   * Function to close Caja
   *
   * @param id string
   */
  cerrarCaja(id: string): void {
    this._store.dispatch([new Navigate([`caja/${id}`]), new CajasMode('cierre')]);
  }
}
