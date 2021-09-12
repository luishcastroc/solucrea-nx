import { Usuario } from '@prisma/client';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AuthState } from 'app/core/auth/store/auth.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectUsuario } from '../_store/ajustes-usuarios.actions';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesTeamComponent implements OnInit, OnDestroy {
    @Select(AuthState.user) usuario$: Observable<Usuario>;
    usuario: Usuario;
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     */
    constructor(private _store: Store) {
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.usuario$.pipe(takeUntil(this._unsubscribeAll)).subscribe((usuario: Usuario) => {
            if (usuario) {
                this.usuario = usuario;
            }
        });
    }

    ngOnDestroy(): void {
        this._store.dispatch(new SelectUsuario(this.usuario));
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
