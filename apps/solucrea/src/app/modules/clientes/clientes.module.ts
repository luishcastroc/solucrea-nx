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
    imports: [RouterModule.forChild(clientesRoutes)],
})
export class ClientesModule {}
