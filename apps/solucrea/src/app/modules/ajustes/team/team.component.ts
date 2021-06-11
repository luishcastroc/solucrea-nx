import { AuthState } from '../../../core/auth/store/auth.state';
import { GetAll } from './../_store/ajustes.actions';
import { takeUntil } from 'rxjs/operators';
import { Usuario, Role } from '@prisma/client';
import { Observable, Subject } from 'rxjs';
import { AjustesState } from './../_store/ajustes.state';
import { Select, Store } from '@ngxs/store';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesTeamComponent implements OnInit, OnDestroy {
    @Select(AjustesState.usuarios) usuarios$: Observable<Usuario[]>;
    usuario = this._store.selectSnapshot(AuthState.user);
    usuarios: Usuario[];
    members: any[];
    roles: any[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: Store
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._store.dispatch(new GetAll(this.usuario.id));
        this.usuarios$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuarios: Usuario[]) => {
                this.usuarios = usuarios;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Setup the roles
        this.roles = [
            {
                label: 'Administrador',
                value: Role.ADMIN,
                description:
                    'Tiene permisos para hacer todo, puede borrar, agregar o editar información.',
            },
            {
                label: 'Cajero',
                value: Role.CAJERO,
                description: 'Puede realizar operaciones generales de caja.',
            },
            {
                label: 'Director',
                value: Role.DIRECTOR,
                description:
                    'Tiene mayoria de permisos a excepcion de manejo de usuarios.',
            },
            {
                label: 'Gerente',
                value: Role.MANAGER,
                description: 'Permisos generales y manejo de dinero.',
            },
            {
                label: 'Usuario',
                value: Role.USUARIO,
                description: 'Usuario general con permisos mínimos.',
            },
        ];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
