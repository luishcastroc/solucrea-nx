import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { Sucursal } from '@prisma/client';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AjustesModeSucursal, GetAllSucursales } from '../../_store/ajustes-sucursales.actions';

@Component({
    selector: 'app-sucusales-list',
    templateUrl: './sucusales-list.component.html',
    styleUrls: ['./sucusales-list.component.scss'],
})
export class SucusalesListComponent implements OnInit {
    @Select(AjustesState.sucursales)
    sucursales$: Observable<Sucursal[]>;

    constructor(private _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAllSucursales());
    }

    /**
     * Navigate to a new user creating a GUID for reference
     *
     * @param item
     *
     */
    openNewSucursal(): void {
        this._store.dispatch([
            new Navigate([`ajustes/sucursales/${AuthUtils.guid()}`]),
            new AjustesModeSucursal('new'),
        ]);
    }

    /**
     *
     * Function to edit Sucursales
     *
     * @param id string
     */
    editSucursal(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/sucursales/${id}`]), new AjustesModeSucursal('edit')]);
    }
}
