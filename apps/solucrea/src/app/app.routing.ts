/* eslint-disable arrow-parens */
import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { Role } from './core/_models/user.model';

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
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
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
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
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
            roles: [Role.all],
        },
        children: [
            {
                path: 'main',
                loadChildren: () =>
                    import('app/modules/main/main.module').then(
                        (m) => m.MainModule
                    ),
            },
            {
                path: 'clientes',
                loadChildren: () =>
                    import('app/modules/clientes/clientes.module').then(
                        (m) => m.ClientesModule
                    ),
            },
            {
                path: 'creditos',
                loadChildren: () =>
                    import('app/modules/creditos/creditos.module').then(
                        (m) => m.CreditosModule
                    ),
            },
            {
                path: 'reportes',
                loadChildren: () =>
                    import('app/modules/reportes/reportes.module').then(
                        (m) => m.ReportesModule
                    ),
            },
            {
                path: 'caja',
                loadChildren: () =>
                    import('app/modules/caja/caja.module').then(
                        (m) => m.CajaModule
                    ),
            },
            {
                path: 'ajustes',
                loadChildren: () =>
                    import('app/modules/ajustes/ajustes.module').then(
                        (m) => m.AjustesModule
                    ),
                data: { roles: [Role.admin] },
            },
        ],
    },
];
