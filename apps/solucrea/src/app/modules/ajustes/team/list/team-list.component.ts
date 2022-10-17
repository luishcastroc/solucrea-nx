import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import {
  Actions,
  ofActionErrored,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { Role, Usuario } from '@prisma/client';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthState } from 'app/core/auth/store/auth.state';
import { EditMode } from 'app/core/models';
import {
  AjustesModeUsuario,
  AjustesUsuariosState,
  DeleteUsuario,
  EditUsuario,
  GetAllUsuarios,
  SelectUsuario,
} from 'app/modules/ajustes/_store';
import { ConfirmationDialogComponent } from 'app/shared';
import { Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { defaultRoles } from '../../_config/roles';
import { IRole } from '../../models/roles.model';

@Component({
  selector: 'team-list',
  templateUrl: './team-list.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamListComponent implements OnInit, OnDestroy {
  usuarios$!: Observable<Usuario[]>;
  loading$!: Observable<boolean>;

  searchResults$!: Observable<Usuario[]>;
  usuario = this._store.selectSnapshot(AuthState.user);
  searchResults!: Usuario[];
  roles: IRole[] = defaultRoles;
  searchInput: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
    private _actions$: Actions,
    private _toast: HotToastService
  ) {
    this.usuarios$ = this._store.select(AjustesUsuariosState.usuarios);
    this.loading$ = this._store.select(AjustesUsuariosState.loading);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    if (this.usuario) {
      this._store.dispatch(new GetAllUsuarios(this.usuario.id));
    }

    // generating a new observable from the searchInput based on the criteria
    this.searchResults$ = this.searchInput.valueChanges.pipe(
      takeUntil(this._unsubscribeAll),
      startWith(''),
      withLatestFrom(this.usuarios$),
      map(([value, usuarios]) => this._filter(value, usuarios))
    );

    this._actions$
      .pipe(
        ofActionErrored(DeleteUsuario, EditUsuario),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(action => {
        let message = 'Error al modificar rol de usuario.';
        if (action instanceof DeleteUsuario) {
          message = 'Error al borrar usuario.';
        }

        this._toast.error(message, {
          duration: 4000,
          position: 'bottom-center',
        });
      });

    this._actions$
      .pipe(
        ofActionSuccessful(DeleteUsuario, EditUsuario),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(action => {
        let message = 'Rol de usuario modificado exitosamente';
        if (action instanceof DeleteUsuario) {
          message = 'Usuario eliminado exitosamente.';
        }

        this._toast.success(message, {
          duration: 4000,
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
    this._store.dispatch([
      new Navigate([`ajustes/usuarios/${AuthUtils.guid()}`]),
      new AjustesModeUsuario('new'),
    ]);
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
    confirmDialog.afterClosed().subscribe(result => {
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
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   *
   * @param value
   * Function to filter results on usuarios
   *
   */
  private _filter(value: string, usuarios: Usuario[]): Usuario[] {
    //getting the value from the input
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return usuarios;
    }

    // returning the filtered array
    return usuarios.filter(
      usuario =>
        usuario.nombre.toLowerCase().includes(filterValue) ||
        usuario.apellido.toLowerCase().includes(filterValue) ||
        usuario.nombreUsuario.toLowerCase().includes(filterValue)
    );
  }
}
