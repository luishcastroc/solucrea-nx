import { Component, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  template: '',
})
export abstract class CustomControlBaseComponent implements OnInit, OnDestroy {
  control!: FormControl | UntypedFormControl;
  required = false;
  selected!: string;
  disabled = false;

  private destroy: Subject<any> = new Subject<any>();

  private _injector = inject(Injector);

  ngOnInit(): void {
    this.setComponentControl();
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

    this.required = this.control.hasValidator(Validators.required) ? true : false;
  }
}
