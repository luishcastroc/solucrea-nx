import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component';
import { authSignOutRoutes } from 'app/modules/auth/sign-out/sign-out.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [AuthSignOutComponent],
  imports: [
    RouterModule.forChild(authSignOutRoutes),
    MatButtonModule,
    FuseCardComponent,
    SharedModule,
  ],
})
export class AuthSignOutModule {}
