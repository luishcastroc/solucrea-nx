import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorKeys',
  standalone: true,
})
export class ErrorKeysPipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string[] | undefined {
    if (!errors) {
      return;
    }
    return Object.keys(errors);
  }
}
