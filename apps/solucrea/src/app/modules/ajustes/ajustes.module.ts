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
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'app/shared/shared.module';

import { AjustesState } from './_store/ajustes.state';
import { AjustesAccountComponent } from './account/account.component';
import { AjustesComponent } from './ajustes.component';
import { ajustesRoutes } from './ajustes.routing';
import { AjustesSecurityComponent } from './security/security.component';
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
        NgxsModule.forFeature([AjustesState]),
    ],
})
export class AjustesModule {}
