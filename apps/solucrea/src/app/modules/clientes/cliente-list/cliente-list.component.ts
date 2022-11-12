import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { IClienteReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import {
  ClientesMode,
  ClientesState,
  Edit,
  GetAllCount,
  Inactivate,
  Search,
} from 'app/modules/clientes/_store';
import { debounceTime, distinctUntilChanged, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteListComponent implements OnInit, AfterViewInit {
  searchResults$!: Observable<IClienteReturnDto[]>;
  clientesCount$!: Observable<number | undefined>;

  values: string[] = ['Activos', 'Inactivos'];
  active: string = this.values[0];
  searchValueChanges$!: Observable<string>;
  actions$!: Observable<any>;
  searchInput = new UntypedFormControl();

  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _toast = inject(HotToastService);

  constructor() {
    this.searchResults$ = this._store.select(ClientesState.clientes);
    this.clientesCount$ = this._store.select(ClientesState.clientesCount);
  }

  ngOnInit(): void {
    this._store.dispatch(new GetAllCount());

    this.subscribeToActions();
  }

  ngAfterViewInit(): void {
    this.searchValueChanges$ = this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(search => {
        this._store.dispatch(new Search(search));
      })
    );
  }

  /**
   * Function to subscribe to actions
   *
   *
   */
  subscribeToActions(): void {
    this.actions$ = this._actions$.pipe(
      ofActionCompleted(Inactivate, Edit),
      tap(result => {
        const { error, successful } = result.result;
        const { action } = result;
        if (error) {
          const message = `${(error as HttpErrorResponse)['error'].message}`;
          this._toast.error(message, {
            duration: 4000,
            position: 'bottom-center',
          });
        }
        if (successful) {
          let message;
          if (action instanceof Inactivate) {
            message = 'Cliente Inhabilitado exitosamente.';
          } else {
            message = 'Cliente habilitado exitosamente.';
          }
          this._toast.success(message, {
            duration: 4000,
            position: 'bottom-center',
          });
          this.searchInput.updateValueAndValidity({
            onlySelf: false,
            emitEvent: true,
          });
        }
      })
    );
  }

  /**
   *
   * function to generate a new Cliente
   */
  newCliente() {
    this._store.dispatch([
      new Navigate([`clientes/${AuthUtils.guid()}`]),
      new ClientesMode('new'),
    ]);
  }

  /**
   *
   * Function to edit Clientes
   *
   * @param id string
   */
  editCliente(id: string): void {
    this._store.dispatch([
      new Navigate([`clientes/${id}`]),
      new ClientesMode('edit'),
    ]);
  }

  /**
   *
   * Function to go to creditos
   *
   * @param id string
   */
  goToCreditos(id: string) {
    this._store.dispatch([new Navigate([`creditos/cliente/${id}`])]);
  }

  /**
   *
   * Function to inactivate a client
   *
   * @param id string
   */
  inactivateClient(id: string) {
    this._store.dispatch(new Inactivate(id));
  }

  /**
   *
   * Function to activate a client
   *
   * @param id string
   */
  activateClient(id: string) {
    this._store.dispatch(new Edit(id, { activo: true }));
  }
}
