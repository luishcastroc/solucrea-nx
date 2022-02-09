import { Route } from '@angular/router';

import { DataCheckGuard } from '../../core/auth/guards';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClientesComponent } from './clientes.component';

export const clientesRoutes: Route[] = [
    {
        path: '',
        component: ClientesComponent,
        pathMatch: 'prefix',
        children: [
            { path: '', component: ClienteListComponent },
            {
                path: ':id',
                canDeactivate: [DataCheckGuard],
                component: ClienteComponent,
            },
        ],
    },
];
