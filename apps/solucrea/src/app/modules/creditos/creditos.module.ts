import { InputMaskModule } from '@ngneat/input-mask';
import { SharedModule } from './../../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosComponent } from './creditos.component';
import { creditosRoutes } from './creditos.routing';
import { CreditosState } from './_store/creditos.state';
import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';

@NgModule({
    declarations: [CreditosComponent, CreditosListComponent, CreditosDetailComponent, CreditosClienteListComponent],
    imports: [
        RouterModule.forChild(creditosRoutes),
        CommonModule,
        NgxsModule.forFeature([CreditosState]),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatTooltipModule,
        SharedModule,
        InputMaskModule,
    ],
})
export class CreditosModule {}
