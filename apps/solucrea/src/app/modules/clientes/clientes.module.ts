import { NgModule } from '@angular/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
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

import { SharedModule } from './../../shared/shared.module';
import { ClientesState } from './_store/clientes.state';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClientesComponent } from './clientes.component';
import { clientesRoutes } from './clientes.routing';

@NgModule({
    declarations: [ClientesComponent, ClienteComponent, ClienteListComponent],
    imports: [
        RouterModule.forChild(clientesRoutes),
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
        NgxsModule.forFeature([ClientesState]),
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    ],
})
export class ClientesModule {}
