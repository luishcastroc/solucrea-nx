import { NgModule } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
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
import { ClientesState } from './_store/clientes.state';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClientesComponent } from './clientes.component';
import { clientesRoutes } from './clientes.routing';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';

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
        MatLuxonDateModule,
        MatRadioModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        SharedModule,
        InputMaskModule,
        FuseScrollbarModule,
        NgxsModule.forFeature([ClientesState]),
    ],
})
export class ClientesModule {}
