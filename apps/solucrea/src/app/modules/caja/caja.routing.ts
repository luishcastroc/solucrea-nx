import { Route } from '@angular/router';
import { DataCheckGuard } from 'app/core/auth/guards/data-check.guard';

import { CajaDetailComponent } from './caja-detail/caja-detail.component';
import { CajaListComponent } from './caja-list/caja-list.component';
import { CajaComponent } from './caja.component';
import { MovimientosComponent } from './movimientos/movimientos.component';

export const cajaRoutes: Route[] = [
  {
    path: '',
    component: CajaComponent,
    pathMatch: 'prefix',
    children: [
      { path: '', component: CajaListComponent },
      {
        path: ':id',
        canDeactivate: [DataCheckGuard],
        component: CajaDetailComponent,
      },
      {
        path: ':id/movimientos',
        component: MovimientosComponent,
      },
    ],
  },
];
