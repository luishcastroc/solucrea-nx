import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { Observable, Subject, takeUntil } from 'rxjs';

import { EditUsuario } from '../_store/usuarios/ajustes-usuarios.actions';
import { AjustesUsuariosState } from '../_store/usuarios/ajustes-usuarios.state';
import { createPasswordStrengthValidator } from '../validators/custom-ajustes.validators';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesSecurityComponent implements OnInit, OnDestroy {
    @Select(AjustesUsuariosState.selectedUsuario)
    user$!: Observable<Usuario>;
    securityForm!: UntypedFormGroup;
    usuario!: Usuario;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _store: Store,
        private _actions$: Actions,
        private _toast: HotToastService
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
            newPassword: ['', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]],
        });

        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
            if (user) {
                this.usuario = user;
            }
        });

        this._actions$.pipe(ofActionErrored(EditUsuario), takeUntil(this._unsubscribeAll)).subscribe(() => {
            const message = 'Error al editar contraseña.';
            this._toast.error(message, {
                duration: 4000,
                position: 'bottom-center',
            });
            this.securityForm.enable();
        });

        this._actions$.pipe(ofActionSuccessful(EditUsuario), takeUntil(this._unsubscribeAll)).subscribe(() => {
            const message = 'Contraseña modificada exitosamente.';
            this._toast.success(message, {
                duration: 4000,
                position: 'bottom-center',
            });
            this.securityForm.enable();
            this.securityForm.reset();
        });
    }

    /**
     * Save new password to the DB
     *
     */
    submitNewPassword(): void {
        this.securityForm.disable();
        this._store.dispatch(
            new EditUsuario(this.usuario.id, {
                password: this.newPassword.value,
                oldPassword: this.currentPassword.value,
            })
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
