import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { MovimientoDeCaja } from '@prisma/client';
import { Observable } from 'rxjs';

import { CajasState, GetAllMovimientos } from '../_store';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
