import { ClientesMode } from './../_store/clientes.actions';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Navigate } from '@ngxs/router-plugin';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-cliente-list',
    templateUrl: './cliente-list.component.html',
    styleUrls: ['./cliente-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteListComponent implements OnInit {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    newCliente() {
        this._store.dispatch([new Navigate([`clientes/${AuthUtils.guid()}`]), new ClientesMode('new')]);
    }
}
