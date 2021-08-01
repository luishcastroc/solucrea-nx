import { NgxsModule } from '@ngxs/store';
import { ClientesState } from './_store/clientes.state';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { ClienteComponent } from './cliente/cliente.component';
import { ClientesComponent } from './clientes.component';
import { clientesRoutes } from './clientes.routing';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

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
        SharedModule,
        NgxsModule.forFeature([ClientesState]),
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
})
export class ClientesModule {}
