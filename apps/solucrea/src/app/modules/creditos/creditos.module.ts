import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosComponent } from './creditos.component';
import { creditosRoutes } from './creditos.routing';
import { CreditosClienteDetailComponent } from './creditos-cliente-detail/creditos-cliente-detail.component';

@NgModule({
    declarations: [CreditosComponent, CreditosListComponent, CreditosDetailComponent, CreditosClienteDetailComponent],
    imports: [RouterModule.forChild(creditosRoutes)],
})
export class CreditosModule {}
