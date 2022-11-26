import { importProvidersFrom } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { DataCheckGuard } from 'app/core/auth/guards';
import { CreditosState } from './_store';

export const creditosRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./creditos.component').then(com => com.CreditosComponent),
    pathMatch: 'prefix',
    providers: [importProvidersFrom(NgxsModule.forFeature([CreditosState]))],
    children: [
      {
        path: '',
        loadComponent: () => import('./creditos-list/creditos-list.component').then(com => com.CreditosListComponent),
      },
      {
        path: ':creditoId',
        canDeactivate: [DataCheckGuard],
        loadComponent: () =>
          import('./creditos-detail/creditos-detail.component').then(com => com.CreditosDetailComponent),
      },
      {
        path: 'cliente/:clienteId',
        loadComponent: () =>
          import('./creditos-cliente-list/creditos-cliente-list.component').then(
            com => com.CreditosClienteListComponent
          ),
      },
      {
        path: 'cliente/:clienteId/detail/:creditoId',
        loadComponent: () =>
          import('./creditos-detail/creditos-detail.component').then(com => com.CreditosDetailComponent),
      },
    ],
  },
];
