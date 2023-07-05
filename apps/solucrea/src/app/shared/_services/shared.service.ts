import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /**
   * return the dirty values if a reactiveForm
   *
   * @param form
   */
  getDirtyValues(form: FormGroup | FormArray): any {
    let dirtyValues: { [key: string]: any } = {};

    Object.keys(form.controls).forEach(key => {
      const currentControl = form.get(key);

      if (currentControl) {
        if (key === 'id') {
          dirtyValues[key] = currentControl.value;
        }

        if (currentControl.dirty) {
          if (currentControl instanceof FormGroup || currentControl instanceof FormArray) {
            const childDirtyValues = this.getDirtyValues(currentControl);
            if (childDirtyValues) {
              // If any child control is dirty, mark the whole group as dirty
              dirtyValues = { ...form.value };
            }
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      }
    });

    return Object.keys(dirtyValues).length > 0 ? dirtyValues : null;
  }
}
