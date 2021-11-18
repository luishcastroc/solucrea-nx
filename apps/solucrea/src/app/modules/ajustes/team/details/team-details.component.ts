import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAlert } from '@fuse/components/alert/alert.model';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { EditMode } from 'app/core/models';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

import { AddUsuario, ClearUsuarioState, EditUsuario } from '../../_store/ajustes-usuarios.actions';
import { IRole } from '../../models/roles.model';
import { defaultRoles } from '../../_config/roles';
import { createPasswordStrengthValidator } from '../../validators/custom-ajustes.validators';

@Component({
    selector: 'team-details',
    templateUrl: './team-details.component.html',
    styleUrls: ['./team-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailsComponent implements OnInit, OnDestroy {
    @Select(AjustesState.editMode) editMode$: Observable<EditMode>;
    @Select(AjustesState.selectedUsuario) selectedUsuario$: Observable<Usuario>;
    selectedUsuario: Usuario;
    usuarioForm: FormGroup;
    successMessage: string;
    errorMessage: string;
    mode: EditMode;
    roles: IRole[] = defaultRoles;

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
        private _route: ActivatedRoute,
        private _toast: HotToastService
    ) {
        this._unsubscribeAll = new Subject();
    }

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
        combineLatest([this.selectedUsuario$, this.editMode$])
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(([selectedUsuario, editMode]) => ({
                    selectedUsuario,
                    editMode,
                }))
            )
            .subscribe(({ selectedUsuario, editMode }) => {
                this.mode = editMode;
                this.setMessage(editMode);
                this.createUsuarioForm(editMode);
                if (selectedUsuario) {
                    this.selectedUsuario = selectedUsuario;
                    if (editMode === 'edit') {
                        this.usuarioForm.patchValue(this.selectedUsuario);
                    }
                }
            });

        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionErrored(EditUsuario, AddUsuario)).subscribe(() => {
            const message = this.errorMessage;
            this._toast.error(message, {
                duration: 4000,
                position: 'bottom-center',
            });
            this.usuarioForm.enable();
        });

        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionSuccessful(EditUsuario, AddUsuario))
            .subscribe((action) => {
                const message = this.successMessage;
                this._toast.success(message, {
                    duration: 4000,
                    position: 'bottom-center',
                });
                this.usuarioForm.enable();
                if (this.mode === 'password') {
                    this.usuarioForm.reset();
                }
                if (action instanceof AddUsuario) {
                    setTimeout(() => {
                        this._store.dispatch(new Navigate(['/ajustes/usuarios/']));
                    }, 2000);
                }
            });
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
        const id = this._route.snapshot.paramMap.get('id');
        const usuario = { id, ...this.usuarioForm.value };
        this._store.dispatch(new AddUsuario(usuario));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._store.dispatch(new ClearUsuarioState());
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
