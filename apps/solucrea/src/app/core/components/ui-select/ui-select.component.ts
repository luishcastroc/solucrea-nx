import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Provider,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorKeysPipe } from 'app/shared';

import { validationMessages } from '../../models/validation-messages';
import { CustomControlBaseComponent } from '../customControlBase';
import { CustomFieldErrorMatcher } from '../customErrorFieldMatcher';

const INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiSelectComponent),
  multi: true,
};

interface SelectOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    ErrorKeysPipe,
  ],
  template: `<ng-container *ngIf="control">
    <mat-form-field class="w-full" subscriptSizing="dynamic">
      <mat-label *ngIf="label && showLabel">{{ label }}</mat-label>
      <mat-icon *ngIf="icon" class="icon-size-5" [class]="iconClasses" [svgIcon]="icon" matPrefix></mat-icon>
      <mat-select
        [(ngModel)]="value"
        [required]="required"
        [disabled]="disabled"
        [errorStateMatcher]="errorMatcher()"
        (change)="valueChange()"
        (blur)="onTouched($event)">
        <mat-option *ngFor="let option of selectOptions" [value]="option.value">{{ option.label }}</mat-option>
      </mat-select>
    </mat-form-field>
    <ng-container *ngIf="control?.touched">
      <mat-error *ngFor="let error of control.errors | errorKeys">
        {{ messages[error] }}
      </mat-error>
    </ng-container>
  </ng-container>`,
  styleUrls: ['./ui-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [INPUT_CONTROL_VALUE_ACCESSOR],
})
export class UiSelectComponent<T> extends CustomControlBaseComponent implements ControlValueAccessor, OnChanges {
  @Input() label = '';
  @Input() showLabel = true;
  @Input() iconClasses = '';
  @Input() icon = '';
  @Input() options: T[] | undefined = [];
  @Input() valueProp!: keyof T;
  @Input() labelProp!: keyof T;
  @Input() placeholder?: string;
  @Input() messages = validationMessages;
  @Input() styles = '';

  selectedValue!: T;
  selectOptions!: SelectOption<T>[];

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options) {
      if (changes['options'].currentValue.length > 0) {
        if (typeof this.options[0] === 'object' && (!this.valueProp || !this.labelProp)) {
          console.error('options is an object valueProp and labelProp properties needs to be provided');
        }
        this.selectOptions = this.options.map<SelectOption<T>>(option => ({
          value: option[this.valueProp] as T,
          label: option[this.labelProp] as string,
        }));
      }
    }
  }

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
