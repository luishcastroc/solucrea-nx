import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { AjustesCreditosState, AjustesSucursalesState, AjustesUsuariosState } from './_store';

export const ajustesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ajustes.component').then(com => com.AjustesComponent),
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'perfil',
      },
      {
        path: 'perfil',
        loadComponent: () => import('./account/account.component').then(com => com.AjustesAccountComponent),
      },
      {
        path: 'seguridad',
        loadComponent: () => import('./security/security.component').then(com => com.AjustesSecurityComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./team/team.component').then(com => com.AjustesTeamComponent),
        providers: [importProvidersFrom(NgxsModule.forFeature([AjustesUsuariosState]))],
        children: [
          {
            path: '',
            loadComponent: () => import('./team/list/team-list.component').then(com => com.TeamListComponent),
          },
          {
            path: ':id',
            loadComponent: () => import('./team/details/team-details.component').then(com => com.TeamDetailsComponent),
          },
        ],
      },
      {
        path: 'sucursales',
        loadComponent: () => import('./sucursales/sucursales.component').then(com => com.SucursalesComponent),
        providers: [importProvidersFrom(NgxsModule.forFeature([AjustesSucursalesState]))],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./sucursales/list/sucusales-list.component').then(com => com.SucusalesListComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./sucursales/details/sucursales-details.component').then(com => com.SucursalesDetailsComponent),
          },
        ],
      },
      {
        path: 'creditos',
        loadComponent: () => import('./creditos/ajustes-creditos.component').then(com => com.AjustesCreditosComponent),
        providers: [importProvidersFrom(NgxsModule.forFeature([AjustesCreditosState]))],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./creditos/list/ajustes-creditos-list.component').then(com => com.AjustesCreditosListComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./creditos/details/ajustes-creditos-details.component').then(
                com => com.AjustesCreditosDetailsComponent
              ),
          },
        ],
      },
    ],
  },
];
