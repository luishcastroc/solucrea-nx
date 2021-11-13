import { ProductosDetailsComponent } from './productos/details/productos-details.component';
import { ProductosListComponent } from './productos/list/productos-list.component';
import { ProductosComponent } from './productos/productos.component';
import { Route } from '@angular/router';

import { AjustesAccountComponent } from './account/account.component';
import { AjustesComponent } from './ajustes.component';
import { AjustesSecurityComponent } from './security/security.component';
import { SucursalesDetailsComponent } from './sucursales/details/sucursales-details.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { SucusalesListComponent } from './sucursales/list/sucusales-list.component';
import { TeamDetailsComponent } from './team/details/team-details.component';
import { TeamListComponent } from './team/list/team-list.component';
import { AjustesTeamComponent } from './team/team.component';

export const ajustesRoutes: Route[] = [
    {
        path: '',
        component: AjustesComponent,
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'perfil',
            },
            {
                path: 'perfil',
                component: AjustesAccountComponent,
            },
            { path: 'seguridad', component: AjustesSecurityComponent },
            {
                path: 'usuarios',
                component: AjustesTeamComponent,
                children: [
                    { path: '', component: TeamListComponent },
                    {
                        path: ':id',
                        component: TeamDetailsComponent,
                    },
                ],
            },
            {
                path: 'sucursales',
                component: SucursalesComponent,
                children: [
                    { path: '', component: SucusalesListComponent },
                    {
                        path: ':id',
                        component: SucursalesDetailsComponent,
                    },
                ],
            },
            {
                path: 'productos',
                component: ProductosComponent,
                children: [
                    { path: '', component: ProductosListComponent },
                    {
                        path: ':id',
                        component: ProductosDetailsComponent,
                    },
                ],
            },
        ],
    },
];
