import { TeamDetailsComponent } from './team/details/team-details.component';
import { TeamListComponent } from './team/list/team-list.component';
import { AjustesTeamComponent } from './team/team.component';
import { AjustesSecurityComponent } from './security/security.component';
import { AjustesAccountComponent } from './account/account.component';
import { Route } from '@angular/router';
import { AjustesComponent } from './ajustes.component';

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
        ],
    },
];
