import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgForm,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { IAlert } from '@fuse/components/alert/alert.model';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Login } from 'app/core/auth/';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit, OnDestroy {
  @ViewChild('signInNgForm')
  signInNgForm!: NgForm;
  usuario: string | null = localStorage.getItem('usuario');
  loading = false;

  alert: IAlert = {
    appearance: 'outline',
    dismissed: true,
    dismissible: true,
    type: 'success',
    message: '',
    name: 'alertBoxSignIn',
    showIcon: true,
    dismissTime: 4,
  };
  signInForm!: UntypedFormGroup;
  private destroy$ = new Subject<any>();
  private _activatedRoute = inject(ActivatedRoute);
  private _store = inject(Store);
  private _formBuilder = inject(UntypedFormBuilder);
  private _actions$ = inject(Actions);
  private _fuseAlertService = inject(FuseAlertService);
  private _cdr = inject(ChangeDetectorRef);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.signInForm = this._formBuilder.group({
      username: [this.usuario ? this.usuario : '', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [
        {
          value: this.usuario ? true : false,
          disabled: this.usuario ? false : true,
        },
      ],
    });

    this._actions$
      .pipe(ofActionCompleted(Login), takeUntil(this.destroy$))
      .subscribe((result: { result?: any; action?: any }) => {
        const { error, successful } = result.result;
        const { action } = result;
        const httpError = error as HttpErrorResponse;
        this.loading = false;
        this._cdr.markForCheck();
        this.signInForm.enable();
        this.signInNgForm.resetForm();
        let message: string;
        if (error) {
          if (httpError['error'].message) {
            message = httpError['error'].message;
          } else if (httpError['status'] === 0) {
            message = 'El Servicio no está disponible, verificar.';
          } else {
            message = httpError['message'];
          }
          this.alert = {
            ...this.alert,
            type: 'error',
            message,
          };
          this._fuseAlertService.show(this.alert);
        }
      });

    if (this.signInForm) {
      this.signInForm
        .get('username')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          if (value) {
            this.signInForm.get('rememberMe')?.enable();
          } else {
            this.signInForm.get('rememberMe')?.disable();
          }
        });
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    const { username, password, rememberMe } = this.signInForm.value;
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this._fuseAlertService.dismiss(this.alert);

    const redirectURL =
      this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
      '/signed-in-redirect';

    this.loading = true;

    // Sign in
    this._store.dispatch(
      new Login({ username, password, redirectURL, rememberMe })
    );
  }

  /**
   *
   * Function recordarme
   *
   * @param event
   */
  recordarme(e: any): void {
    const { checked } = e;
    if (!checked) {
      localStorage.removeItem('usuario');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
