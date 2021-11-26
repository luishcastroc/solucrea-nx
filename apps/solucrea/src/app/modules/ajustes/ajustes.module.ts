import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'app/shared/shared.module';

import { AjustesCreditosState } from './_store/creditos/ajustes-creditos.state';
import { AjustesSucursalesState } from './_store/sucursales/ajustes-sucursales.state';
import { AjustesUsuariosState } from './_store/usuarios/ajustes-usuarios.state';
import { AjustesAccountComponent } from './account/account.component';
import { AjustesComponent } from './ajustes.component';
import { ajustesRoutes } from './ajustes.routing';
import { AjustesCreditosComponent } from './creditos/ajustes-creditos.component';
import { AjustesCreditosDetailsComponent } from './creditos/details/ajustes-creditos-details.component';
import { AjustesCreditosListComponent } from './creditos/list/ajustes-creditos-list.component';
import { AjustesSecurityComponent } from './security/security.component';
import { SeguroDetailComponent } from './seguro/detail/seguro-detail.component';
import { SeguroListComponent } from './seguro/list/seguro-list.component';
import { SeguroComponent } from './seguro/seguro.component';
import { SucursalesDetailsComponent } from './sucursales/details/sucursales-details.component';
import { SucusalesListComponent } from './sucursales/list/sucusales-list.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { TeamDetailsComponent } from './team/details/team-details.component';
import { TeamListComponent } from './team/list/team-list.component';
import { AjustesTeamComponent } from './team/team.component';

@NgModule({
    declarations: [
        AjustesComponent,
        AjustesAccountComponent,
        AjustesSecurityComponent,
        AjustesTeamComponent,
        TeamDetailsComponent,
        TeamListComponent,
        SucursalesComponent,
        SucusalesListComponent,
        SucursalesDetailsComponent,
        AjustesCreditosComponent,
        AjustesCreditosDetailsComponent,
        AjustesCreditosListComponent,
        SeguroListComponent,
        SeguroDetailComponent,
        SeguroComponent,
    ],
    imports: [
        RouterModule.forChild(ajustesRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseAutogrowModule,
        SharedModule,
        InputMaskModule,
        NgxsModule.forFeature([AjustesSucursalesState, AjustesUsuariosState, AjustesCreditosState]),
    ],
})
export class AjustesModule {}
