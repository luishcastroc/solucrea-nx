import { fuseAnimations } from './../../../../../@fuse/animations/public-api';
import { takeUntil } from 'rxjs/operators';
import { Usuario } from '@prisma/client';
import { IAlert } from '@fuse/components/alert/alert.model';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store, Select, Actions } from '@ngxs/store';
import { createPasswordStrengthValidator } from '../../validators/custom.validators';

@Component({
    selector: 'team-details',
    templateUrl: './team-details.component.html',
    styleUrls: ['./team-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TeamDetailsComponent implements OnInit {
    @Select(AjustesState.editMode) editMode$: Observable<boolean>;
    @Select(AjustesState.selectedUsuario) selectedUsuario$: Observable<Usuario>;
    selectedUsuario: Usuario;
    usuarioForm: FormGroup;

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
    }

    createUsuarioForm(): void {
        this.usuarioForm = this._formBuilder.group({
            nombre: [''],
            apellido: [''],
            nombreUsuario: [''],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    createPasswordStrengthValidator(),
                ],
            ],
        });
    }

    deleteContact(): void {
        console.log('delete');
    }

    toggleEditMode(value: boolean): void {
        console.log('toggleEditMode');
    }

    updateContact(): void {
        console.log('updateContact');
    }
}
