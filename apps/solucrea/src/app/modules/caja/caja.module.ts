import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CajaComponent } from './caja.component';

const cajaRoutes: Route[] = [
    {
        path: '',
        component: CajaComponent,
    },
];

@NgModule({
    declarations: [CajaComponent],
    imports: [RouterModule.forChild(cajaRoutes)],
})
export class CajaModule {}
