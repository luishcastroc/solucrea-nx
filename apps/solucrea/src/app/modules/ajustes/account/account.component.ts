import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { UpdateUsuario } from 'app/core/auth';
import { AjustesUsuariosState, EditUsuario } from 'app/modules/ajustes/_store';
import { isEqual } from 'lodash';
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AjustesAccountComponent implements OnInit {
    user$: Observable<Usuario>;
    actions$: Actions;

    accountForm: FormGroup;
    defaultUser: Usuario;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _store: Store,
        private _actions$: Actions,
        private _toast: HotToastService,
        private location: Location
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.createUserForm();

        this.user$ = this._store.select(AjustesUsuariosState.selectedUsuario).pipe(
            tap((user: Usuario) => {
                if (user) {
                    this.defaultUser = user;
                    this.accountForm.patchValue(this.defaultUser);
                }
            })
        );

        this.setActions();
    }

    /**
     *
     * Create user form
     */
    createUserForm(): void {
        this.accountForm = this._formBuilder.group({
            nombre: [''],
            apellido: [''],
            nombreUsuario: [''],
        });
    }

    /**
     * Function to set the actions behavior
     *
     *
     */
    setActions(): void {
        this.actions$ = this._actions$.pipe(
            ofActionCompleted(UpdateUsuario),
            tap((result) => {
                const { error, successful } = result.result;
                if (error) {
                    const message = `${error['error'].message}`;
                    this._toast.error(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                }
                if (successful) {
                    const message = 'Usuario modificado exitosamente.';
                    this._toast.success(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                    this.accountForm.enable();
                }
            })
        );
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
}
