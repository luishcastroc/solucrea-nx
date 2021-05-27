import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CreditosComponent } from './creditos.component';

const creditosRoutes: Route[] = [
    {
        path: '',
        component: CreditosComponent,
    },
];

@NgModule({
    declarations: [CreditosComponent],
    imports: [RouterModule.forChild(creditosRoutes)],
})
export class CreditosModule {}
