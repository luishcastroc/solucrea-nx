import { Route } from '@angular/router';
import { DataCheckGuard } from 'app/core/auth/guards/data-check.guard';

export const cajaRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./caja.component').then(com => com.CajaComponent),
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./caja-list/caja-list.component').then(
            com => com.CajaListComponent
          ),
      },
      {
        path: ':id',
        canDeactivate: [DataCheckGuard],
        loadComponent: () =>
          import('./caja-detail/caja-detail.component').then(
            com => com.CajaDetailComponent
          ),
      },
      {
        path: ':id/movimientos',
        loadComponent: () =>
          import('./movimientos/movimientos.component').then(
            com => com.MovimientosComponent
          ),
      },
    ],
  },
];
