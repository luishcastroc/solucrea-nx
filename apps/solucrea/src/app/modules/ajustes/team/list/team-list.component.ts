import { fuseAnimations } from '@fuse/animations';
import { IAlert } from '@fuse/components/alert/alert.model';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { Delete } from './../../_store/ajustes.actions';
import { ConfirmationDialogComponent } from './../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { IRole } from './../../models/roles.model';
import { Navigate } from '@ngxs/router-plugin';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    Select,
    Store,
    Actions,
    ofActionErrored,
    ofActionSuccessful,
} from '@ngxs/store';
import { Role, Usuario } from '@prisma/client';
import { AuthState } from 'app/core/auth/store/auth.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GetAll } from '../../_store/ajustes.actions';
import { AjustesState } from '../../_store/ajustes.state';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TeamListComponent implements OnInit, OnDestroy {
    @Select(AjustesState.usuarios) usuarios$: Observable<Usuario[]>;
    usuario = this._store.selectSnapshot(AuthState.user);
    usuarios: Usuario[];
    roles: IRole[];
    alert: IAlert = {
        appearance: 'soft',
        name: 'alertBoxDel',
        type: 'success',
        dismissible: true,
        dismissed: true,
        showIcon: true,
        message: '',
        dismissTime: 4,
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _fuseAlertService: FuseAlertService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._store.dispatch(new GetAll(this.usuario.id));
        this.usuarios$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuarios: Usuario[]) => {
                this.usuarios = usuarios;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Setup the roles
        this.roles = [
            {
                label: 'Administrador',
                value: Role.ADMIN,
                description:
                    'Tiene permisos para hacer todo, puede borrar, agregar o editar información.',
            },
            {
                label: 'Cajero',
                value: Role.CAJERO,
                description: 'Puede realizar operaciones generales de caja.',
            },
            {
                label: 'Director',
                value: Role.DIRECTOR,
                description:
                    'Tiene mayoria de permisos a excepcion de manejo de usuarios.',
            },
            {
                label: 'Gerente',
                value: Role.MANAGER,
                description: 'Permisos generales y manejo de dinero.',
            },
            {
                label: 'Usuario',
                value: Role.USUARIO,
                description: 'Usuario general con permisos mínimos.',
            },
        ];

        this._actions$.pipe(ofActionErrored(Delete)).subscribe(() => {
            this.alert = {
                ...this.alert,
                type: 'error',
                message: 'Error al borrar usuario.',
            };

            this._fuseAlertService.show(this.alert);
        });

        this._actions$.pipe(ofActionSuccessful(Delete)).subscribe(() => {
            this.alert = {
                ...this.alert,
                type: 'success',
                message: 'Usuario eliminado exitosamente.',
            };

            this._fuseAlertService.show(this.alert);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Navigate to a new user creating a GUID for reference
     *
     * @param index
     * @param item
     */
    openNewUser(): void {
        this._store.dispatch(
            new Navigate([`ajustes/usuarios/${AuthUtils.guid()}`])
        );
    }

    /**
     * Save User after changing it's Role
     *
     * @param role
     *
     */
    saveUser(usuario: Usuario, role: string): void {
        console.log('save user', role);
    }

    /**
     * Delete the selected user
     *
     * @param id
     *
     */
    deleteUser(usuario: Usuario): void {
        const confirmDialog = this._dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Confirmar Borrar Usuario',
                message: `Estas seguro que deseas borrar el usuario: ${usuario.nombreUsuario}`,
            },
        });
        confirmDialog.afterClosed().subscribe((result) => {
            if (result === true) {
                this._store.dispatch(new Delete(usuario.id));
            }
        });
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