import { ActivatedRoute } from '@angular/router';
import { EditMode } from './../../_store/ajustes.model';
import { Edit, Add } from './../../_store/ajustes.actions';
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
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

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
    @Select(AjustesState.editMode) editMode$: Observable<EditMode>;
    @Select(AjustesState.selectedUsuario) selectedUsuario$: Observable<Usuario>;
    selectedUsuario: Usuario;
    usuarioForm: FormGroup;
    successMessage: string;
    errorMessage: string;
    mode: EditMode;

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
        private _fuseAlertService: FuseAlertService,
        private _route: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
    }

    get password() {
        return this.usuarioForm.controls['password'];
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
                if (selectedUsuario) {
                    this.createUsuarioForm();
                    this.selectedUsuario = selectedUsuario;
                    if (editMode === 'edit') {
                        this.usuarioForm.patchValue(this.selectedUsuario);
                    }
                }
            });

        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionErrored(Edit, Add))
            .subscribe(() => {
                this.alert = {
                    ...this.alert,
                    type: 'error',
                    message: this.errorMessage,
                };

                this._fuseAlertService.show(this.alert);
                this.usuarioForm.enable();
            });

        this._actions$
            .pipe(
                takeUntil(this._unsubscribeAll),
                ofActionSuccessful(Edit, Add)
            )
            .subscribe((action) => {
                this.alert = {
                    ...this.alert,
                    type: 'success',
                    message: this.successMessage,
                };

                this._fuseAlertService.show(this.alert);
                this.usuarioForm.enable();
                if (this.mode === 'password') {
                    this.usuarioForm.reset();
                }
                if (action instanceof Add) {
                    setTimeout(() => {
                        this._store.dispatch(
                            new Navigate(['/ajustes/usuarios/'])
                        );
                    }, 4000);
                }
            });
    }

    /**
     * Generate user form
     *
     */
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

        this._store.dispatch(new Edit(this.selectedUsuario.id, usuario));
    }

    /**
     * Save new Usuario to the DB
     *
     */
    saveUsuario(): void {
        const id = this._route.snapshot.paramMap.get('id');
        const usuario = { id, ...this.usuarioForm.value };
        this._store.dispatch(new Add(usuario));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
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
