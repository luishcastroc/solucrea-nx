import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConfirmationDialogComponent } from 'app/shared';
import { Observable, of } from 'rxjs';

import { CanDeactivateComponent } from '../../models/can-deactivate.model';

@Injectable({
  providedIn: 'root',
})
export class DataCheckGuard  {
  private _dialog = inject(MatDialog);

  canDeactivate(
    component: CanDeactivateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (typeof component.canDeactivate === 'function' && !component.canDeactivate()) {
      const confirmDialog = this._dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmar Salir',
          message: 'Estas seguro que deseas salir de la Página, la información capturada será borrada.',
        },
      });

      return confirmDialog.afterClosed();
    }
    return of(true);
  }
}
