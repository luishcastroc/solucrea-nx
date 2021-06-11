import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ClientesComponent } from './clientes.component';

const clientesRoutes: Route[] = [
    {
        path: '',
        component: ClientesComponent,
    },
];

@NgModule({
    declarations: [ClientesComponent],
    imports: [
        RouterModule.forChild(clientesRoutes),
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
    ],
})
export class ClientesModule {}
