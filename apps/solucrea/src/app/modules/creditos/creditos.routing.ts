import { Route } from '@angular/router';
import { DataCheckGuard } from 'app/core/auth/guards/data-check.guard';
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
                path: ':id',
                canDeactivate: [DataCheckGuard],
                component: CreditosDetailComponent,
            },
        ],
    },
];
