import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionErrored, ofActionSuccessful, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { Observable, Subject, takeUntil } from 'rxjs';

import { EditUsuario } from '../_store/usuarios/ajustes-usuarios.actions';
import { AjustesUsuariosState } from '../_store/usuarios/ajustes-usuarios.state';
import { createPasswordStrengthValidator } from '../validators/custom-ajustes.validators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'settings-security',
  templateUrl: './security.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatIconModule, NgFor, NgIf],
})
export class AjustesSecurityComponent implements OnInit, OnDestroy {
  user$!: Observable<Usuario | undefined>;
  securityForm!: UntypedFormGroup;
  usuario!: Usuario;
  private _unsubscribeAll: Subject<any>;

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _formBuilder = inject(UntypedFormBuilder);

  /**
   * Constructor
   */
  constructor() {
    this._unsubscribeAll = new Subject();
    this.user$ = this._store.select(AjustesUsuariosState.selectedUsuario);
  }

  get currentPassword() {
    return this.securityForm.controls['currentPassword'];
  }

  get newPassword() {
    return this.securityForm.controls['newPassword'];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.securityForm = this._formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]],
    });

    this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
      if (user) {
        this.usuario = user;
      }
    });

    this._actions$.pipe(ofActionErrored(EditUsuario), takeUntil(this._unsubscribeAll)).subscribe(() => {
      const message = 'Error al editar contraseña.';
      this._toast.error(message, {
        duration: 4000,
        position: 'bottom-center',
      });
      this.securityForm.enable();
    });

    this._actions$.pipe(ofActionSuccessful(EditUsuario), takeUntil(this._unsubscribeAll)).subscribe(() => {
      const message = 'Contraseña modificada exitosamente.';
      this._toast.success(message, {
        duration: 4000,
        position: 'bottom-center',
      });
      this.securityForm.enable();
      this.securityForm.reset();
    });
  }

  /**
   * Save new password to the DB
   *
   */
  submitNewPassword(): void {
    this.securityForm.disable();
    this._store.dispatch(
      new EditUsuario(this.usuario.id, {
        password: this.newPassword.value,
        oldPassword: this.currentPassword.value,
      })
    );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
