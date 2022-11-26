import { Route } from '@angular/router';

import { DataCheckGuard } from '../../core/auth/guards';

export const clientesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./clientes.component').then(com => com.ClientesComponent),
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        loadComponent: () => import('./cliente-list/cliente-list.component').then(com => com.ClienteListComponent),
      },
      {
        path: ':id',
        canDeactivate: [DataCheckGuard],
        loadComponent: () => import('./cliente/cliente.component').then(com => com.ClienteComponent),
      },
    ],
  },
];
