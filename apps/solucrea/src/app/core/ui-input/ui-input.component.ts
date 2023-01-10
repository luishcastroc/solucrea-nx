import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Provider,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
  ReactiveFormsModule,
  UntypedFormControl,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputMaskModule, InputmaskOptions } from '@ngneat/input-mask';
import { ErrorKeysPipe } from 'app/shared';
import { Subject, takeUntil, tap } from 'rxjs';

import { validationMessages } from '../models/validation-messages';

const INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiInputComponent),
  multi: true,
};

export class CustomFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private customControl: FormControl | UntypedFormControl) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.customControl && this.customControl.touched && this.customControl.invalid;
  }
}

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
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <mat-icon *ngIf="icon" class="icon-size-5" [svgIcon]="icon" matPrefix></mat-icon>
      <input
        [value]="value"
        [(ngModel)]="value"
        [inputMask]="mask"
        [required]="required"
        [disabled]="disabled"
        [errorStateMatcher]="errorMatcher()"
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
export class UiInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label = '';
  @Input() type = 'text';
  @Input() icon = '';
  @Input() required = false;
  @Input() options: string[] = [];
  @Input() placeholder?: string;
  @Input() messages = validationMessages;
  @Input() mask!: InputmaskOptions<any>;
  @Input() styles = '';

  control!: FormControl | UntypedFormControl;
  selected!: string;
  disabled = false;

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => ctrl && ctrl.invalid,
  };

  //Internal data model
  private innerValue = '';

  private _injector = inject(Injector);
  private destroy: Subject<any> = new Subject<any>();

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

  ngOnInit(): void {
    this.setComponentControl();
  }

  //The writeValue function allows you to update your internal model with incoming values
  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.destroy.next(null);
    this.destroy.complete();
  }

  private setComponentControl(): void {
    const injectedControl = this._injector.get(NgControl);

    switch (injectedControl.constructor) {
      case NgModel: {
        const { control, update } = injectedControl as NgModel;

        this.control = control;

        this.control.valueChanges
          .pipe(
            tap((value: any) => {
              update.emit(value);
            }),
            takeUntil(this.destroy)
          )
          .subscribe();
        break;
      }
      case FormControlName: {
        this.control = this._injector.get(FormGroupDirective).getControl(injectedControl as FormControlName);
        break;
      }
      default: {
        this.control = (injectedControl as FormControlDirective).form as FormControl;
        break;
      }
    }
  }
}
