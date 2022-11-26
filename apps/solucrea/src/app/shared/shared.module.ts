import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DecimalToNumberPipe } from './pipes/decimalnumber.pipe';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmationDialogComponent],
})
export class SharedModule {}
