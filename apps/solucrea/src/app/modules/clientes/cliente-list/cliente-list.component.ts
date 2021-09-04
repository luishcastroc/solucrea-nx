import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { IClienteReturnDto } from 'api/dtos';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { ClientesMode, GetAll } from '../_store/clientes.actions';
import { ClientesState } from '../_store/clientes.state';

@Component({
    selector: 'app-cliente-list',
    templateUrl: './cliente-list.component.html',
    styleUrls: ['./cliente-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteListComponent implements OnInit, OnDestroy {
    @Select(ClientesState.clientes) clientes$: Observable<IClienteReturnDto[]>;

    clientes: IClienteReturnDto[];
    searchResults$: Observable<IClienteReturnDto[]>;
    searchInput = new FormControl();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _store: Store, private _changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAll());

        this.clientes$.pipe(takeUntil(this._unsubscribeAll)).subscribe((clientes: IClienteReturnDto[]) => {
            this.clientes = clientes;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // generating a new observable from the searchInput based on the criteria
        this.searchResults$ = this.searchInput.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            startWith(''),
            map((value) => this._filter(value))
        );
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
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     *
     * @param value
     * Function to filter results on clientes
     *
     */
    private _filter(value: string): IClienteReturnDto[] {
        //getting the value from the input
        const filterValue = value.toLowerCase();
        if (filterValue === '') {
            return [];
        }

        // returning the filtered array
        return this.clientes.filter(
            (cliente) =>
                cliente.nombre.toLowerCase().includes(filterValue) ||
                cliente.apellidoPaterno.toLowerCase().includes(filterValue) ||
                cliente.apellidoMaterno.toLowerCase().includes(filterValue) ||
                cliente.rfc.toLowerCase().includes(filterValue) ||
                cliente.curp.toLowerCase().includes(filterValue)
        );
    }
}
