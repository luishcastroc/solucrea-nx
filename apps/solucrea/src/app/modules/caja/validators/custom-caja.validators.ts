import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';
import { of } from 'rxjs';

export const futureDateValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }

        const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        const validDate = value > today;

        return of(validDate ? { futureDateValidator: true } : null);
    };

export const checkIfEndDateBeforeStartDate =
    (): ValidatorFn =>
    (group: UntypedFormGroup | any): ValidationErrors | null => {
        const todayDate = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const value = group.getRawValue();
        const fechaApertura = group.get('fechaApertura')?.value
            ? DateTime.fromISO(group.get('fechaApertura')?.value)
            : null;
        const fechaCierre = group.get('fechaCierre')?.value ? DateTime.fromISO(group.get('fechaCierre')?.value) : null;

        if (!value || !fechaApertura || !fechaCierre) {
            return null;
        }

        const validDate = fechaCierre >= fechaApertura && fechaCierre <= todayDate;

        if (!validDate) {
            group.get('fechaCierre')?.setErrors({ checkIfEndDateBeforeStartDate: true });
        }

        return validDate ? null : { checkIfEndDateBeforeStartDate: true };
    };
