import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosComponent } from './creditos.component';
import { creditosRoutes } from './creditos.routing';

@NgModule({
    declarations: [CreditosComponent, CreditosListComponent, CreditosDetailComponent],
    imports: [RouterModule.forChild(creditosRoutes)],
})
export class CreditosModule {}
