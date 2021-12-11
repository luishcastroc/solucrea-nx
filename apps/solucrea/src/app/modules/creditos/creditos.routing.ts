import { Route } from '@angular/router';
import { DataCheckGuard } from 'app/core/auth/guards/data-check.guard';
import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';
import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';

import { CreditosComponent } from './creditos.component';

export const creditosRoutes: Route[] = [
    {
        path: '',
        component: CreditosComponent,
        pathMatch: 'prefix',
        children: [
            { path: '', component: CreditosListComponent },
            {
                path: ':creditoId',
                canDeactivate: [DataCheckGuard],
                component: CreditosDetailComponent,
            },
            { path: 'cliente/:clienteId', component: CreditosClienteListComponent },
            { path: 'cliente/:clienteId/detail/:creditoId', component: CreditosDetailComponent },
        ],
    },
];
