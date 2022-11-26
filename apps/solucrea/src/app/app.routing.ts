import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { Role } from '@prisma/client';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard, NoAuthGuard } from 'app/core/auth/guards';
import { LayoutComponent } from 'app/layout/layout.component';

import { CajasState } from './pages/caja/_store';
import { ClientesState } from './pages/clientes/_store';

/* eslint-disable arrow-parens */
// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  { path: '', pathMatch: 'full', redirectTo: 'main' },

  // Redirect signed in user to the '/main'
  //
  // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'main' },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    loadComponent: () => import('./layout/layout.component').then(com => com.LayoutComponent),
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('app/pages/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('app/pages/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule),
      },
      {
        path: 'sign-in',
        loadChildren: () => import('app/pages/auth/sign-in/sign-in.routing').then(m => m.authSignInRoutes),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('app/pages/auth/sign-out/sign-out.routing').then(m => m.authSignOutRoutes),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    data: {
      roles: [Role.ALL],
    },
    children: [
      {
        path: 'main',
        loadChildren: () => import('app/pages/main/main.routing').then(m => m.mainRoutes),
      },
      {
        path: 'clientes',
        loadChildren: () => import('app/pages/clientes/clientes.routing').then(m => m.clientesRoutes),
        providers: [importProvidersFrom(NgxsModule.forFeature([ClientesState]))],
      },
      {
        path: 'creditos',
        loadChildren: () => import('app/pages/creditos/creditos.routing').then(m => m.creditosRoutes),
      },
      {
        path: 'mutualcrea',
        loadChildren: () => import('app/pages/mutualcrea/mutualcrea.routing').then(m => m.mutualcreaRoutes),
      },
      {
        path: 'reportes',
        loadChildren: () => import('app/pages/reportes/reportes.routing').then(m => m.reportesRoutes),
      },
      {
        path: 'caja',
        canLoad: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER] },
        loadChildren: () => import('app/pages/caja/caja.routing').then(m => m.cajaRoutes),
        providers: [importProvidersFrom(NgxsModule.forFeature([CajasState]))],
      },
      {
        path: 'ajustes',
        loadChildren: () => import('app/pages/ajustes/ajustes.routing').then(m => m.ajustesRoutes),
      },
    ],
  },
];
