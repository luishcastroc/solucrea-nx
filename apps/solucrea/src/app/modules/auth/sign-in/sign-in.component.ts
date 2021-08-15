import { takeUntil } from 'rxjs/operators';
import { IAlert } from './../../../../@fuse/components/alert/alert.model';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Actions, ofActionErrored, Store } from '@ngxs/store';
import { Login } from 'app/core/auth/store/auth.actions';
import { Subject } from 'rxjs';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit, OnDestroy {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    usuario: string = localStorage.getItem('usuario');

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
    signInForm: FormGroup;
    private destroy$ = new Subject<void>();

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

        this._actions$.pipe(takeUntil(this.destroy$), ofActionErrored(Login)).subscribe(() => {
            this.signInForm.enable();
            this.signInNgForm.resetForm();
            this.alert = {
                ...this.alert,
                type: 'error',
                message: 'El usuario o contraseña son erroneos, favor de verificar.',
            };
            this._fuseAlertService.show(this.alert);
        });

        this.signInForm
            .get('username')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.signInForm.get('rememberMe').enable();
                } else {
                    this.signInForm.get('rememberMe').disable();
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        const { username, password } = this.signInForm.value;
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
        this._store.dispatch(new Login({ username, password, redirectURL }));
    }

    /**
     *
     * Function recordarme
     *
     * @param event
     */
    recordarme(e): void {
        const { checked } = e;
        const { username } = this.signInForm.value;
        if (checked && username) {
            localStorage.setItem('usuario', username);
        } else {
            localStorage.removeItem('usuario');
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
