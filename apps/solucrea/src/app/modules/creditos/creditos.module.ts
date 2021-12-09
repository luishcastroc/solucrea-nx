import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosComponent } from './creditos.component';
import { creditosRoutes } from './creditos.routing';
import { CreditosState } from './_store/creditos.state';

@NgModule({
    declarations: [CreditosComponent, CreditosListComponent, CreditosDetailComponent],
    imports: [RouterModule.forChild(creditosRoutes), CommonModule, NgxsModule.forFeature([CreditosState])],
})
export class CreditosModule {}
