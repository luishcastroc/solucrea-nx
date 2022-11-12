import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /**
   * return the dirty values if a reactiveForm
   *
   * @param form
   */
  getDirtyValues(form: any): any {
    const dirtyValues: { [key: string]: number | string } = {};
    let prevId: string = '';

    Object.keys(form.controls).forEach(key => {
      const currentControl = form.controls[key];
      if (key === 'id') {
        dirtyValues[key] = currentControl.value;
      }

      if (currentControl.dirty) {
        if (currentControl.controls) {
          dirtyValues[key] = this.getDirtyValues(currentControl);
        } else {
          dirtyValues[key] = currentControl.value;
        }
      }
      if (key === 'direcciones') {
        prevId = key;
      }
    });

    return Object.keys(dirtyValues).length > 0 ? dirtyValues : null;
  }
}
