import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'app/shared/shared.module';

import { CreditosState } from './../creditos/_store/creditos.state';
import { CreditosClienteDetailComponent } from './creditos-cliente-detail/creditos-cliente-detail.component';
import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';
import { CreditosClienteComponent } from './creditos-cliente.component';
import { creditosClienteRoutes } from './creditos-cliente.routing';

@NgModule({
    declarations: [CreditosClienteDetailComponent, CreditosClienteListComponent, CreditosClienteComponent],
    imports: [
        RouterModule.forChild(creditosClienteRoutes),
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
export class CreditosClienteModule {}
