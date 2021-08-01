import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { Route } from '@angular/router';

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
                component: ClienteComponent,
            },
        ],
    },
];
