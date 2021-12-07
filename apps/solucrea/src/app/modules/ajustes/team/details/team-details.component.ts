import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { EditMode } from 'app/core/models';
import { AddUsuario, AjustesUsuariosState, ClearUsuarioState, EditUsuario } from 'app/modules/ajustes/_store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { defaultRoles } from '../../_config/roles';
import { IRole } from '../../models/roles.model';
import { createPasswordStrengthValidator } from '../../validators/custom-ajustes.validators';

@Component({
    selector: 'team-details',
    templateUrl: './team-details.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailsComponent implements OnInit, OnDestroy {
    editMode$: Observable<EditMode>;
    selectedUsuario$: Observable<Usuario>;
    actions$: Actions;
    editMode: EditMode;
    selectedUsuario: Usuario;
    usuarioForm: FormGroup;
    successMessage: string;
    errorMessage: string;
    roles: IRole[] = defaultRoles;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _store: Store,
        private _actions$: Actions,
        private _route: ActivatedRoute,
        private _toast: HotToastService
    ) {}

    get password() {
        return this.usuarioForm.controls['password'];
    }

    get nombre() {
        return this.usuarioForm.controls['nombre'];
    }

    get apellido() {
        return this.usuarioForm.controls['apellido'];
    }

    get nombreUsuario() {
        return this.usuarioForm.controls['nombreUsuario'];
    }

    get role() {
        return this.usuarioForm.controls['role'];
    }

    ngOnInit(): void {
        this.initializeData();

        this.setActions();
    }

    /**
     *
     * Initialize the selectors for the mode
     *
     */
    initializeData(): void {
        this.editMode$ = this._store.select(AjustesUsuariosState.editMode).pipe(
            tap((edit) => {
                this.setMessage(edit);
                this.createUsuarioForm(edit);
                this.editMode = edit;

                this.selectedUsuario$ = this._store.select(AjustesUsuariosState.selectedUsuario).pipe(
                    tap((usuario: Usuario) => {
                        if ((usuario && edit === 'edit') || edit === 'password') {
                            this.selectedUsuario = usuario;
                            this.usuarioForm.patchValue(this.selectedUsuario);
                        }
                    })
                );
            })
        );
    }

    /**
     * Function to set the actions behavior
     *
     *
     */
    setActions(): void {
        this.actions$ = this._actions$.pipe(
            ofActionCompleted(EditUsuario, AddUsuario),
            tap((result) => {
                const { error, successful } = result.result;
                const { action } = result;
                if (error) {
                    const message = `${error['error'].message}`;
                    this._toast.error(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });
                }
                if (successful) {
                    const message = this.successMessage;
                    this._toast.success(message, {
                        duration: 4000,
                        position: 'bottom-center',
                    });

                    if (action instanceof AddUsuario) {
                        setTimeout(() => {
                            this._store.dispatch(new Navigate(['/ajustes/usuarios/']));
                        }, 3000);
                    }
                }
            })
        );
    }

    /**
     * Generate user form
     *
     */
    createUsuarioForm(editMode: EditMode): void {
        const passwordValidators =
            editMode === 'new'
                ? [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]
                : [Validators.minLength(8), createPasswordStrengthValidator()];

        const requiredValue = editMode === 'new' ? Validators.required : null;

        this.usuarioForm = this._formBuilder.group({
            nombre: ['', requiredValue],
            apellido: ['', requiredValue],
            nombreUsuario: ['', requiredValue],
            role: ['', requiredValue],
            password: ['', passwordValidators],
        });
    }

    /**
     * Navigate to the ajustes screen
     *
     */
    cancelEdit(): void {
        this._store.dispatch(new Navigate(['/ajustes/usuarios']));
    }

    /**
     * update Usuario in the database, this can be only password or full user
     *
     * @param mode
     */
    updateUsuario(): void {
        const { nombre, apellido, nombreUsuario, password, role } = this.usuarioForm.value;
        let usuario;
        if (!password) {
            usuario = {
                ...this.selectedUsuario,
                nombre,
                apellido,
                nombreUsuario,
                role,
            };
        } else {
            usuario = { ...this.selectedUsuario, password };
        }

        this._store.dispatch(new EditUsuario(this.selectedUsuario.id, usuario));
    }

    /**
     * Save new Usuario to the DB
     *
     */
    saveUsuario(): void {
        this.usuarioForm.disable();
        const id = this._route.snapshot.paramMap.get('id');
        const usuario = { id, ...this.usuarioForm.value };
        this._store.dispatch(new AddUsuario(usuario));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._store.dispatch(new ClearUsuarioState());
    }

    /**
     * Set error and success messages depending on the component mode
     *
     * @param mode
     */
    private setMessage(mode: EditMode): void {
        switch (mode) {
            case 'edit':
                this.successMessage = 'Usuario modificado exitosamente.';
                this.errorMessage = 'Error al modificar el usuario.';
                break;
            case 'password':
                this.successMessage = 'Contraseña modificada exitosamente.';
                this.errorMessage = 'Error al modificar la contraseña.';
                break;
            default:
                this.successMessage = 'Usuario creado exitosamente.';
                this.errorMessage = 'Error al crear usuario.';
        }
    }
}
