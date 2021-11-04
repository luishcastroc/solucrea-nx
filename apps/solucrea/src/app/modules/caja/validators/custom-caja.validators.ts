import { of } from 'rxjs';
import { AbstractControl, ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';
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

export const checkIfEndDateBeforeStartDate =
    (): ValidatorFn =>
    (group: FormGroup): ValidationErrors | null => {
        const todayDate = moment();
        const value = group.getRawValue();
        const fechaApertura = group.get('fechaApertura').value ? moment(group.get('fechaApertura').value) : null;
        const fechaCierre = group.get('fechaCierre').value ? moment(group.get('fechaCierre').value) : null;

        if (!value || !fechaApertura || !fechaCierre) {
            return null;
        }

        const validDate = fechaCierre.isSameOrAfter(fechaApertura) && fechaCierre.isSameOrBefore(todayDate);

        if (!validDate) {
            group.get('fechaCierre').setErrors({ checkIfEndDateBeforeStartDate: true });
        }

        return validDate ? null : { checkIfEndDateBeforeStartDate: true };
    };
