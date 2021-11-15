import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { isEqual } from 'lodash';
import { Observable, Subject, takeUntil } from 'rxjs';

import { EditUsuario } from '../_store/ajustes-usuarios.actions';
import { AjustesState } from '../_store/ajustes.state';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AjustesAccountComponent implements OnInit, OnDestroy {
    @Select(AjustesState.selectedUsuario) user$: Observable<Usuario>;

    accountForm: FormGroup;
    defaultUser: Usuario;
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

        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionErrored(EditUsuario)).subscribe(() => {
            const message = 'Error al editar usuario.';
            this._toast.error(message, {
                duration: 4000,
                position: 'bottom-center',
            });
            this.accountForm.enable();
        });

        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionSuccessful(EditUsuario)).subscribe(() => {
            const message = 'Usuario modificado exitosamente.';
            this._toast.success(message, {
                duration: 4000,
                position: 'bottom-center',
            });
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
            this._store.dispatch(new EditUsuario(this.defaultUser.id, this.accountForm.value));
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
