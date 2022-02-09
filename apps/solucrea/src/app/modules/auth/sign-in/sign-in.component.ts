import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { IAlert } from '@fuse/components/alert/alert.model';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { Actions, ofActionErrored, Store } from '@ngxs/store';
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
    signInForm!: FormGroup;
    private destroy$ = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _fuseAlertService: FuseAlertService
    ) {}

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

        this._actions$.pipe(ofActionErrored(Login), takeUntil(this.destroy$)).subscribe(() => {
            this.signInForm.enable();
            this.signInNgForm.resetForm();
            this.alert = {
                ...this.alert,
                type: 'error',
                message: 'El usuario o contraseña son erroneos, favor de verificar.',
            };
            this._fuseAlertService.show(this.alert);
        });

        if (this.signInForm) {
            this.signInForm
                .get('username')
                ?.valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
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

        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        // Sign in
        this._store.dispatch(new Login({ username, password, redirectURL, rememberMe }));
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
