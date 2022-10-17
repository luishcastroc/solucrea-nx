import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { FuseScrollbarModule } from '@fuse/directives/scrollbar/public-api';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from './../../shared/shared.module';
import { CreditosState } from './_store/creditos.state';
import { CreditosClienteListComponent } from './creditos-cliente-list/creditos-cliente-list.component';
import { CreditosDetailComponent } from './creditos-detail/creditos-detail.component';
import { CreditosInfoComponent } from './creditos-info/creditos-info.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosNewComponent } from './creditos-new/creditos-new.component';
import { CreditosPagoComponent } from './creditos-pago/creditos-pago.component';
import { CreditosPagosListComponent } from './creditos-pagos-list/creditos-pagos-list.component';
import { CreditosComponent } from './creditos.component';
import { creditosRoutes } from './creditos.routing';

@NgModule({
  declarations: [
    CreditosComponent,
    CreditosListComponent,
    CreditosDetailComponent,
    CreditosClienteListComponent,
    CreditosInfoComponent,
    CreditosNewComponent,
    CreditosPagoComponent,
    CreditosPagosListComponent,
  ],
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
    MatLuxonDateModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    SharedModule,
    InputMaskModule,
    FuseScrollbarModule,
  ],
})
export class CreditosModule {}
