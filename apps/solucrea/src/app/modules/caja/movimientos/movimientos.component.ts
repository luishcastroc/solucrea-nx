import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  movimientos$: Observable<MovimientoDeCaja[]> = this._store.select(
    CajasState.movimientos
  );
  id = this._route.snapshot.paramMap.get('id');
  constructor(private _store: Store, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.id) {
      this._store.dispatch(new GetAllMovimientos(this.id));
    }
  }
}
