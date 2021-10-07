import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'app/shared/shared.module';

import { CajasState } from './_store/caja.state';
import { CajaDetailComponent } from './caja-detail/caja-detail.component';
import { CajaListComponent } from './caja-list/caja-list.component';
import { CajaComponent } from './caja.component';
import { cajaRoutes } from './creditos.routing';

@NgModule({
    declarations: [CajaComponent, CajaListComponent, CajaDetailComponent],
    imports: [
        RouterModule.forChild(cajaRoutes),
        NgxsModule.forFeature([CajasState]),
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        SharedModule,
    ],
})
export class CajaModule {}
