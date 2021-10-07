import { ICajaReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CajasState } from '../_store/caja.state';
import { GetAll } from '../_store/caja.actions';

@Component({
    selector: 'app-caja-list',
    templateUrl: './caja-list.component.html',
    styleUrls: ['./caja-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaListComponent implements OnInit {
    @Select(CajasState.cajas) cajas$: Observable<ICajaReturnDto[]>;

    constructor(private _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAll());
    }
}
