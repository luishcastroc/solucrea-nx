import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { AuthForgotPasswordComponent } from 'app/pages/auth/forgot-password/forgot-password.component';
import { authForgotPasswordRoutes } from 'app/pages/auth/forgot-password/forgot-password.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [AuthForgotPasswordComponent],
  imports: [
    RouterModule.forChild(authForgotPasswordRoutes),
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
export class AuthForgotPasswordModule {}
