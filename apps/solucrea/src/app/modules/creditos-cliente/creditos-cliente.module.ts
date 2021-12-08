import { creditosClienteRoutes } from './creditos-cliente.routing';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreditosClienteDetailComponent } from './creditos-cliente-detail/creditos-cliente-detail.component';
import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';
import { CreditosClienteComponent } from './creditos-cliente.component';

@NgModule({
    declarations: [CreditosClienteDetailComponent, CreditosClienteListComponent, CreditosClienteComponent],
    imports: [RouterModule.forChild(creditosClienteRoutes), CommonModule],
})
export class CreditosClienteModule {}
