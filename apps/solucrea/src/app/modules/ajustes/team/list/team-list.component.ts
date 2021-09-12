import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Role, Usuario } from '@prisma/client';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthState } from 'app/core/auth/store/auth.state';
import { EditMode } from 'app/core/models/edit-mode.type';
import { ConfirmationDialogComponent } from 'app/shared';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import {
    AjustesModeUsuario,
    DeleteUsuario,
    EditUsuario,
    GetAllUsuarios,
    SearchUsuario,
    SelectUsuario,
} from '../../_store/ajustes-usuarios.actions';
import { AjustesState } from '../../_store/ajustes.state';
import { IRole } from '../../models/roles.model';
import { defaultRoles } from '../../roles';

@Component({
    selector: 'team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamListComponent implements OnInit, OnDestroy {
    @Select(AjustesState.searchResults) searchResults$: Observable<Usuario[]>;
    usuario = this._store.selectSnapshot(AuthState.user);
    searchResults: Usuario[];
    roles: IRole[] = defaultRoles;
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: Store,
        private _dialog: MatDialog,
        private _actions$: Actions,
        private _toast: HotToastService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._store.dispatch(new GetAllUsuarios(this.usuario.id));

        this.searchResults$.pipe(takeUntil(this._unsubscribeAll)).subscribe((usuarios: Usuario[]) => {
            this.searchResults = usuarios;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) => this._store.dispatch(new SearchUsuario(query)))
            )
            .subscribe();

        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionErrored(DeleteUsuario, EditUsuario))
            .subscribe((action) => {
                let message = 'Error al modificar rol de usuario.';
                if (action instanceof DeleteUsuario) {
                    message = 'Error al borrar usuario.';
                }

                this._toast.error(message, {
                    duration: 5000,
                    position: 'bottom-center',
                });
            });

        this._actions$
            .pipe(takeUntil(this._unsubscribeAll), ofActionSuccessful(DeleteUsuario, EditUsuario))
            .subscribe((action) => {
                let message = 'Rol de usuario modificado exitosamente';
                if (action instanceof DeleteUsuario) {
                    message = 'Usuario eliminado exitosamente.';
                }

                this._toast.success(message, {
                    duration: 5000,
                    position: 'bottom-center',
                });
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
     * @param item
     *
     */
    openNewUser(): void {
        this._store.dispatch([new Navigate([`ajustes/usuarios/${AuthUtils.guid()}`]), new AjustesModeUsuario('new')]);
    }

    /**
     * Edit user
     *
     * @param usuario
     *
     */
    editUser(usuario: Usuario, mode: EditMode): void {
        this._store.dispatch([
            new Navigate([`ajustes/usuarios/${usuario.id}`]),
            new SelectUsuario(usuario),
            new AjustesModeUsuario(mode),
        ]);
    }

    /**
     * Save User after changing it's Role
     *
     * @param role
     *
     */
    saveUser(usuario: Usuario, role: Role): void {
        if (usuario.role !== role) {
            const usuarioUpdate = { ...usuario, role };
            this._store.dispatch(new EditUsuario(usuarioUpdate.id, usuarioUpdate));
        }
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
                this._store.dispatch(new DeleteUsuario(usuario.id));
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
