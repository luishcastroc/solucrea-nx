import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import {
    Actions,
    ofActionErrored,
    ofActionSuccessful,
    Select,
    Store,
} from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { AuthState } from 'app/core/auth/store/auth.state';
import { isEqual } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAlert } from '@fuse/components/alert/alert.model';
import { Edit } from '../_store/ajustes.actions';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AjustesAccountComponent implements OnInit {
    @Select(AuthState.user) user$: Observable<Usuario>;

    accountForm: FormGroup;
    defaultUser: Usuario;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.accountForm = this._formBuilder.group({
            nombre: [''],
            apellido: [''],
            nombreUsuario: [''],
        });

        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
            if (user) {
                this.defaultUser = user;
                this.accountForm.patchValue(this.defaultUser);
            }
        });

        this._actions$.pipe(ofActionErrored(Edit)).subscribe(() => {
            this.alert = {
                ...this.alert,
                type: 'error',
                message: 'Error al editar usuario.',
            };

            this._fuseAlertService.show(this.alert);
            this.accountForm.enable();
        });

        this._actions$.pipe(ofActionSuccessful(Edit)).subscribe(() => {
            this.alert = {
                ...this.alert,
                type: 'success',
                message: 'Usuario modificado exitosamente.',
            };

            this._fuseAlertService.show(this.alert);
            this.accountForm.enable();
        });
    }

    cancelEdit(): void {
        if (this.defaultUser) {
            this.accountForm.patchValue(this.defaultUser);
        }
    }

    saveChanges(): void {
        const prevUser = (({ nombre, apellido, nombreUsuario }) => ({
            nombre,
            apellido,
            nombreUsuario,
        }))(this.defaultUser);

        if (!isEqual(prevUser, this.accountForm.value)) {
            this.accountForm.disable();
            this._store.dispatch(
                new Edit(this.defaultUser.id, this.accountForm.value)
            );
        }
    }
}
