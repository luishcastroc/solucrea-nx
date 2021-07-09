import { Edit } from './../../_store/ajustes.actions';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { IAlert } from '@fuse/components/alert/alert.model';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { Navigate } from '@ngxs/router-plugin';
import {
    Actions,
    Select,
    Store,
    ofActionErrored,
    ofActionSuccessful,
} from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { createPasswordStrengthValidator } from '../../validators/custom.validators';

@Component({
    selector: 'team-details',
    templateUrl: './team-details.component.html',
    styleUrls: ['./team-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TeamDetailsComponent implements OnInit, OnDestroy {
    @Select(AjustesState.editMode) editMode$: Observable<boolean>;
    @Select(AjustesState.selectedUsuario) selectedUsuario$: Observable<Usuario>;
    selectedUsuario: Usuario;
    usuarioForm: FormGroup;
    message: { success: string; error: string };

    alert: IAlert = {
        appearance: 'soft',
        name: 'alertBoxAj',
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

    get password() {
        return this.usuarioForm.controls['password'];
    }

    ngOnInit(): void {
        this.selectedUsuario$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuario: Usuario) => {
                if (usuario) {
                    this.selectedUsuario = usuario;
                    this.createUsuarioForm();
                    this.usuarioForm.patchValue(this.selectedUsuario);
                }
            });

        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionErrored(Edit))
            .subscribe(() => {
                this.alert = {
                    ...this.alert,
                    type: 'error',
                    message: this.message.error,
                };

                this._fuseAlertService.show(this.alert);
                this.usuarioForm.enable();
            });

        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionSuccessful(Edit))
            .subscribe(() => {
                this.alert = {
                    ...this.alert,
                    type: 'success',
                    message: this.message.success,
                };

                this._fuseAlertService.show(this.alert);
                this.usuarioForm.enable();
            });
    }

    createUsuarioForm(): void {
        this.usuarioForm = this._formBuilder.group({
            nombre: [''],
            apellido: [''],
            nombreUsuario: [''],
            password: [
                '',
                [Validators.minLength(8), createPasswordStrengthValidator()],
            ],
        });
    }

    deleteContact(): void {
        console.log('delete');
    }

    cancelEdit(): void {
        this._store.dispatch(new Navigate(['/ajustes/usuarios']));
    }

    updateContact(): void {
        console.log('updateContact');
        const { nombre, apellido, nombreUsuario, password } =
            this.usuarioForm.value;
        let usuario;
        if (!password) {
            usuario = {
                ...this.selectedUsuario,
                nombre,
                apellido,
                nombreUsuario,
            };
        } else {
            usuario = { ...this.selectedUsuario, password };
        }

        console.log(usuario);
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
