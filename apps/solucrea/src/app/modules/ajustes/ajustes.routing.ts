import { SeguroListComponent } from './seguro/list/seguro-list.component';
import { SeguroComponent } from './seguro/seguro.component';
import { OcupacionesDetailComponent } from './ocupaciones/detail/ocupaciones-detail.component';
import { OcupacionesListComponent } from './ocupaciones/list/ocupaciones-list.component';
import { AjustesOcupacionesComponent } from './ocupaciones/ajustes-ocupaciones.component';
import { Route } from '@angular/router';

import { AjustesAccountComponent } from './account/account.component';
import { AjustesComponent } from './ajustes.component';
import { AjustesCreditosComponent } from './creditos/ajustes-creditos.component';
import { AjustesCreditosDetailsComponent } from './creditos/details/ajustes-creditos-details.component';
import { AjustesCreditosListComponent } from './creditos/list/ajustes-creditos-list.component';
import { AjustesSecurityComponent } from './security/security.component';
import { SucursalesDetailsComponent } from './sucursales/details/sucursales-details.component';
import { SucusalesListComponent } from './sucursales/list/sucusales-list.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { TeamDetailsComponent } from './team/details/team-details.component';
import { TeamListComponent } from './team/list/team-list.component';
import { AjustesTeamComponent } from './team/team.component';
import { SeguroDetailComponent } from './seguro/detail/seguro-detail.component';

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
                path: 'creditos',
                component: AjustesCreditosComponent,
                children: [
                    { path: '', component: AjustesCreditosListComponent },
                    {
                        path: ':id',
                        component: AjustesCreditosDetailsComponent,
                    },
                ],
            },
            {
                path: 'ocupaciones',
                component: AjustesOcupacionesComponent,
                children: [
                    { path: '', component: OcupacionesListComponent },
                    {
                        path: ':id',
                        component: OcupacionesDetailComponent,
                    },
                ],
            },
            {
                path: 'seguros',
                component: SeguroComponent,
                children: [
                    { path: '', component: SeguroListComponent },
                    {
                        path: ':id',
                        component: SeguroDetailComponent,
                    },
                ],
            },
        ],
    },
];
