import { CreditosClienteDetailComponent } from './creditos-cliente-detail/creditos-cliente-detail.component';
import { Route } from '@angular/router';
import { DataCheckGuard } from 'app/core/auth/guards/data-check.guard';

import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';
import { CreditosClienteComponent } from './creditos-cliente.component';

export const creditosClienteRoutes: Route[] = [
    {
        path: '',
        component: CreditosClienteComponent,
        pathMatch: 'prefix',
        children: [
            { path: '', component: CreditosClienteListComponent },
            {
                path: ':id',
                canDeactivate: [DataCheckGuard],
                component: CreditosClienteDetailComponent,
            },
        ],
    },
];
