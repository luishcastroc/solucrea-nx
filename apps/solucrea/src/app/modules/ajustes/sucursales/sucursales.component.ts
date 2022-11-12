import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngxs/store';

import { ClearSucursales } from './../_store/sucursales/ajustes-sucursales.actions';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalesComponent implements OnDestroy {
  private _store = inject(Store);

  ngOnDestroy(): void {
    this._store.dispatch(new ClearSucursales());
  }
}
