import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoComponent {
  private _store = inject(Store);
  private _location = inject(Location);

  /**
   * Function get back to caja main page
   *
   *
   */
  back() {
    this._location.back();
  }
}
