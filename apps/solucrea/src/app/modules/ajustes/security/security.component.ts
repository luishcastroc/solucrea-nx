import { fuseAnimations } from './../../../../@fuse/animations/public-api';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { IAlert } from '@fuse/components/alert/alert.model';
import { Edit } from './../_store/ajustes.actions';
import { takeUntil } from 'rxjs/operators';
import { Usuario } from '@prisma/client';
import { Observable, Subject } from 'rxjs';
import { AuthState } from 'app/core/auth/store/auth.state';
import {
    Store,
    Select,
    Actions,
    ofActionErrored,
    ofActionSuccessful,
} from '@ngxs/store';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createPasswordStrengthValidator } from '../validators/custom.validators';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AjustesSecurityComponent implements OnInit {
    @Select(AuthState.user) user$: Observable<Usuario>;
    securityForm: FormGroup;
    usuario: Usuario;
    alert: IAlert = {
        appearance: 'soft',
        name: 'alertBoxPwd',
        type: 'success',
        dismissible: true,
        dismissed: true,
        showIcon: true,
        message: '',
        dismissTime: 4,
    };
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _store: Store,
        private _actions$: Actions,
        private _fuseAlertService: FuseAlertService
    ) {
        this._unsubscribeAll = new Subject();
    }

    get currentPassword() {
        return this.securityForm.controls['currentPassword'];
    }

    get newPassword() {
        return this.securityForm.controls['newPassword'];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: ['', [Validators.required]],
            newPassword: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    createPasswordStrengthValidator(),
                ],
            ],
        });

        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
            if (user) {
                this.usuario = user;
            }
        });

        this._actions$.pipe(ofActionErrored(Edit)).subscribe(() => {
            this.alert = {
                ...this.alert,
                type: 'error',
                message: 'Error al editar contraseña.',
            };

            this._fuseAlertService.show(this.alert);
            this.securityForm.enable();
        });

        this._actions$.pipe(ofActionSuccessful(Edit)).subscribe(() => {
            this.alert = {
                ...this.alert,
                type: 'success',
                message: 'Contraseña modificada exitosamente.',
            };

            this._fuseAlertService.show(this.alert);
            this.securityForm.enable();
        });
    }

    submitNewPassword(): void {
        this.securityForm.disable();
        this._store.dispatch(
            new Edit(this.usuario.id, {
                password: this.newPassword.value,
                oldPassword: this.currentPassword.value,
            })
        );
    }
}
