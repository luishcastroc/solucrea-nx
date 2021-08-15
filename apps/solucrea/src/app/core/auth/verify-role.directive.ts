import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Role, Usuario } from '@prisma/client';
import { Subject } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthState } from './store/auth.state';

@Directive({
    selector: '[verifyRole]',
})
export class VerifyRoleDirective implements OnInit, OnDestroy {
    @Input() set verifyRole(roles: Role[]) {
        if (roles) {
            this.roles = roles;
        }
    }

    roles: Role[];
    user: Usuario;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private templateRef: TemplateRef<any>,
        private _authService: AuthService,
        private viewContainer: ViewContainerRef,
        private _store: Store
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.user = this._store.selectSnapshot(AuthState.user);

        if (this.roles && this._authService.checkAuthorization(this.user.role, this.roles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
