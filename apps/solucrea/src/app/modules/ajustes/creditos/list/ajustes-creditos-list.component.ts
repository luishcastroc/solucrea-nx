import { Navigate } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Component({
    selector: 'app-list',
    templateUrl: './ajustes-creditos-list.component.html',
    styleUrls: ['./ajustes-creditos-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesCreditosListComponent implements OnInit {
    constructor(private _store: Store) {}

    ngOnInit(): void {}

    /**
     * new Producto
     *
     */
    newProducto(): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${AuthUtils.guid()}`])]);
    }

    /**
     *
     * Function to edit Producto
     *
     * @param id string
     */
    editProduco(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${id}`])]);
    }

    /**
     *
     * Function to delete Producto
     *
     * @param id string
     */
    deleteProducto(id: string): void {
        this._store.dispatch([new Navigate([`ajustes/creditos/${id}`])]);
    }
}
