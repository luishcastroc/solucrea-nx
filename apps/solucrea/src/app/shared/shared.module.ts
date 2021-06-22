import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyRoleDirective } from 'app/core/auth/verify-role.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [VerifyRoleDirective, ConfirmationDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        VerifyRoleDirective,
        ConfirmationDialogComponent,
    ],
})
export class SharedModule {}
