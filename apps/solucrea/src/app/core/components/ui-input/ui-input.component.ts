import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputMaskModule, InputmaskOptions } from '@ngneat/input-mask';
import { ErrorKeysPipe } from 'app/shared';

import { validationMessages } from '../../models/validation-messages';
import { CustomControlBaseComponent } from '../customControlBase';
import { CustomFieldErrorMatcher } from '../customErrorFieldMatcher';

const INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiInputComponent),
  multi: true,
};

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    InputMaskModule,
    ErrorKeysPipe,
  ],
  template: `<ng-container *ngIf="control">
    <mat-form-field class="w-full" subscriptSizing="dynamic">
      <mat-label *ngIf="label && showLabel">{{ label }}</mat-label>
      <mat-icon *ngIf="icon" class="icon-size-5" [class]="iconClasses" [svgIcon]="icon" matPrefix></mat-icon>
      <input
        [value]="value"
        [spellcheck]="spellcheck"
        [(ngModel)]="value"
        [inputMask]="mask"
        [required]="required"
        [disabled]="disabled"
        [errorStateMatcher]="errorMatcher()"
        (change)="valueChange()"
        (blur)="onTouched($event)"
        matInput
        type="'type'" />
    </mat-form-field>
    <ng-container *ngIf="control?.touched">
      <mat-error *ngFor="let error of control.errors | errorKeys">
        {{ messages[error] }}
      </mat-error>
    </ng-container>
  </ng-container>`,
  styleUrls: ['./ui-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [INPUT_CONTROL_VALUE_ACCESSOR],
})
export class UiInputComponent extends CustomControlBaseComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label = '';
  @Input() showLabel = true;
  @Input() iconClasses = '';
  @Input() type = 'text';
  @Input() spellcheck = false;
  @Input() icon = '';
  @Input() placeholder?: string;
  @Input() messages = validationMessages;
  @Input() mask!: InputmaskOptions<any>;
  @Input() styles = '';

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => ctrl && ctrl.invalid,
  };

  //Internal data model
  private innerValue = '';

  private _cdr = inject(ChangeDetectorRef);

  //getter for the inner value
  get value(): any {
    return this.innerValue;
  }

  //setter for the inner value and to trigger the onChanged
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChanged(v);
    }
  }

  onTouched: any = () => {};
  onChanged: any = () => {};

  //The writeValue function allows you to update your internal model with incoming values
  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this._cdr.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  errorMatcher() {
    return new CustomFieldErrorMatcher(this.control);
  }

  valueChange() {
    this.onChanged(this.value);
  }
}
