import { FormControl, FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private customControl: FormControl | UntypedFormControl) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.customControl && this.customControl.touched && this.customControl.invalid;
  }
}
