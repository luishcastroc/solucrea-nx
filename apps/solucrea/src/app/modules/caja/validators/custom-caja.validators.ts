import { of } from 'rxjs';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import moment, { Moment } from 'moment';
export const futureDateValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }

        const today: Moment = moment();

        const validDate = value > today;

        return of(validDate ? { futureDateValidator: true } : null);
    };
