import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { SharedModule } from 'app/shared/shared.module';

import { ajustesRoutes } from './ajustes.routing';
import { AjustesComponent } from './ajustes.component';
import { AjustesAccountComponent } from './account/account.component';
import { AjustesSecurityComponent } from './security/security.component';
import { AjustesTeamComponent } from './team/team.component';

@NgModule({
    declarations: [
        AjustesComponent,
        AjustesAccountComponent,
        AjustesSecurityComponent,
        AjustesTeamComponent,
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
        FuseAlertModule,
        FuseAutogrowModule,
        SharedModule,
    ],
})
export class AjustesModule {}
