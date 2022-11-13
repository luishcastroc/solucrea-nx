import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { AuthResetPasswordComponent } from 'app/pages/auth/reset-password/reset-password.component';
import { authResetPasswordRoutes } from 'app/pages/auth/reset-password/reset-password.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [AuthResetPasswordComponent],
  imports: [
    RouterModule.forChild(authResetPasswordRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardComponent,
    FuseAlertComponent,
    SharedModule,
  ],
})
export class AuthResetPasswordModule {}
