import { ClearUsuarios } from './../_store/usuarios/ajustes-usuarios.actions';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { AuthState } from 'app/core/auth/store/auth.state';
import { Observable, Subject, takeUntil } from 'rxjs';

import { SelectUsuario } from 'app/modules/ajustes/_store';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesTeamComponent implements OnInit, OnDestroy {
    @Select(AuthState.user) usuario$!: Observable<Usuario | undefined>;
    usuario: Usuario | undefined;
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
        this.usuario$.pipe(takeUntil(this._unsubscribeAll)).subscribe((usuario: Usuario | undefined) => {
            if (usuario) {
                this.usuario = usuario;
            }
        });
    }

    ngOnDestroy(): void {
        this._store.dispatch([new SelectUsuario(this.usuario), new ClearUsuarios()]);
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
