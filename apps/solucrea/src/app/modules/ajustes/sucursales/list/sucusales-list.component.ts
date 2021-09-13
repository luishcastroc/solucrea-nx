import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AjustesModeSucursal } from '../../_store/ajustes-sucursales.actions';

@Component({
    selector: 'app-sucusales-list',
    templateUrl: './sucusales-list.component.html',
    styleUrls: ['./sucusales-list.component.scss'],
})
export class SucusalesListComponent implements OnInit {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

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
}
