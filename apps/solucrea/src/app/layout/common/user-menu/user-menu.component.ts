import { BooleanInput } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { AuthState } from 'app/core/auth/store/auth.state';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'userMenu',
})
export class UserMenuComponent implements OnInit, OnDestroy {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static ngAcceptInputType_showAvatar: BooleanInput;
    @Input() showAvatar: boolean = true;
    user$!: Observable<Usuario | undefined>;
    user: Usuario | undefined;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _changeDetectorRef: ChangeDetectorRef, private _store: Store) {
        this.user$ = this._store.select(AuthState.user);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes
        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: Usuario | undefined) => {
            this.user = user;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    goToPerfil(): void {
        this._store.dispatch(new Navigate(['/ajustes/perfil']));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign out
     */
    signOut(): void {
        this._store.dispatch(new Navigate(['/sign-out']));
    }
}
