import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { VerifyRoleDirective } from 'app/core/auth/verify-role.directive';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

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
