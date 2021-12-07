import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { IClienteReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { map, Observable, startWith, Subject, takeUntil, withLatestFrom } from 'rxjs';

import { ClientesMode, Edit, GetAll, Inactivate } from '../_store/clientes.actions';
import { ClientesState } from '../_store/clientes.state';

@Component({
    selector: 'app-cliente-list',
    templateUrl: './cliente-list.component.html',
    styleUrls: ['./cliente-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteListComponent implements OnInit, OnDestroy {
    @Select(ClientesState.clientes) clientes$: Observable<IClienteReturnDto[]>;

    values: string[] = ['Activos', 'Inactivos'];
    active: string = this.values[0];
    clientes: IClienteReturnDto[];
    searchResults$: Observable<IClienteReturnDto[]>;
    searchInput = new FormControl();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _store: Store, private _actions$: Actions, private _toast: HotToastService) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAll());

        this.subscribeToActions();

        // generating a new observable from the searchInput based on the criteria
        this.searchResults$ = this.searchInput.valueChanges.pipe(
            startWith(''),
            withLatestFrom(this.clientes$),
            map(([value, clientes]) => this._filter(value, clientes)),
            takeUntil(this._unsubscribeAll)
        );
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$
            .pipe(ofActionCompleted(Inactivate, Edit), takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
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
                    this.searchInput.updateValueAndValidity({ onlySelf: false, emitEvent: true });
                }
            });
    }

    /**
     *
     * function to generate a new Cliente
     */
    newCliente() {
        this._store.dispatch([new Navigate([`clientes/${AuthUtils.guid()}`]), new ClientesMode('new')]);
    }

    /**
     *
     * Function to edit Clientes
     *
     * @param id string
     */
    editCliente(id: string): void {
        this._store.dispatch([new Navigate([`clientes/${id}`]), new ClientesMode('edit')]);
    }

    /**
     *
     * Function to go to creditos
     *
     * @param id string
     */
    goToCreditos(id: string) {
        this._store.dispatch(new Navigate([`creditos/cliente/${id}`]));
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
     * Function to filter results on clientes
     *
     */
    private _filter(value: string, clientes: IClienteReturnDto[]): IClienteReturnDto[] {
        //getting the value from the input
        const filterValue = value.toLowerCase();
        if (filterValue === '') {
            return [];
        }

        // returning the filtered array
        return clientes.filter(
            (cliente) =>
                (cliente.nombre.toLowerCase().includes(filterValue) ||
                    cliente.apellidoPaterno.toLowerCase().includes(filterValue) ||
                    cliente.apellidoMaterno.toLowerCase().includes(filterValue) ||
                    cliente.rfc.toLowerCase().includes(filterValue) ||
                    cliente.curp.toLowerCase().includes(filterValue)) &&
                cliente.activo === (this.active === 'Activos' ? true : false)
        );
    }
}
