import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';

import { ClearSucursales } from './../_store/sucursales/ajustes-sucursales.actions';

@Component({
  selector: 'app-sucursales',
  template: '<router-outlet></router-outlet>',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class SucursalesComponent implements OnDestroy {
  private _store = inject(Store);

  ngOnDestroy(): void {
    this._store.dispatch(new ClearSucursales());
  }
}
