import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from './../../shared/shared.module';
import { CreditosState } from './_store/creditos.state';
import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';
import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosComponent } from './creditos.component';
import { creditosRoutes } from './creditos.routing';

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
        MatCardModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        SharedModule,
        InputMaskModule,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
})
export class CreditosModule {}
