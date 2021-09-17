import { HotToastService } from '@ngneat/hot-toast';
import { createPasswordStrengthValidator } from '../validators/custom-ajustes.validators';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAlert } from '@fuse/components/alert/alert.model';
import { Actions, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations/public-api';
import { EditUsuario } from '../_store/ajustes-usuarios.actions';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesSecurityComponent implements OnInit, OnDestroy {
    @Select(AjustesState.selectedUsuario) user$: Observable<Usuario>;
    securityForm: FormGroup;
    usuario: Usuario;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
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

        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionErrored(EditUsuario)).subscribe(() => {
            const message = 'Error al editar contraseña.';
            this._toast.error(message, {
                duration: 4000,
                position: 'bottom-center',
            });
            this.securityForm.enable();
        });

        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionSuccessful(EditUsuario)).subscribe(() => {
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
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
