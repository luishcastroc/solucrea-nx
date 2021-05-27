import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyRoleDirective } from 'app/core/auth/verify-role.directive';

@NgModule({
    declarations: [VerifyRoleDirective],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        VerifyRoleDirective,
    ],
})
export class SharedModule {}
