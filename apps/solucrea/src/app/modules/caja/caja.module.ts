import { NgModule } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'app/shared/shared.module';

import { CajasState } from './_store/caja.state';
import { CajaDetailComponent } from './caja-detail/caja-detail.component';
import { CajaListComponent } from './caja-list/caja-list.component';
import { CajaComponent } from './caja.component';
import { cajaRoutes } from './caja.routing';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';

@NgModule({
  declarations: [
    CajaComponent,
    CajaListComponent,
    CajaDetailComponent,
    MovimientosComponent,
  ],
  imports: [
    RouterModule.forChild(cajaRoutes),
    NgxsModule.forFeature([CajasState]),
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    SharedModule,
    InputMaskModule,
    FuseScrollbarModule,
  ],
})
export class CajaModule {}
