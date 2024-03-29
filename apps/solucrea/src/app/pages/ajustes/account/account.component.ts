import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fuseAnimations } from '@fuse/animations/public-api';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { UpdateUsuario } from 'app/core/auth';
import { AjustesUsuariosSelectors, EditUsuario } from 'app/pages/ajustes/_store';
import { isEqual } from 'lodash';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgIf,
    AsyncPipe,
  ],
})
export class AjustesAccountComponent implements OnInit, OnDestroy {
  user$!: Observable<Usuario | undefined>;
  accountForm!: UntypedFormGroup;
  defaultUser!: Usuario;

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);
  private _formBuilder = inject(UntypedFormBuilder);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.createUserForm();

    this.user$ = this._store.select(AjustesUsuariosSelectors.slices.selectedUsuario).pipe(
      tap((user: Usuario | undefined) => {
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
    this._actions$
      .pipe(
        ofActionCompleted(UpdateUsuario),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          if (error) {
            const message = `${(error as HttpErrorResponse)['error'].message}`;
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
      )
      .subscribe();
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
