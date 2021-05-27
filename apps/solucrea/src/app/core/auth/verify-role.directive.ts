import { AuthState } from './store/auth.state';
import { Role, User } from './../_models/user.model';
import { AuthService } from './auth.service';
import {
    Directive,
    OnInit,
    TemplateRef,
    ViewContainerRef,
    Input,
    OnDestroy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select } from '@ngxs/store';

@Directive({
    selector: '[verifyRole]',
})
export class VerifyRoleDirective implements OnInit, OnDestroy {
    @Input() set verifyRole(roles: Role[]) {
        if (roles) {
            this.roles = roles;
        }
    }

    @Select(AuthState.user) user$: Observable<User>;

    roles: Role[];

    private _unsubscribeAll: Subject<any>;

    constructor(
        private templateRef: TemplateRef<any>,
        private _authService: AuthService,
        private viewContainer: ViewContainerRef
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
            if (
                this.roles &&
                this._authService.checkAuthorization(user.role, this.roles)
            ) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainer.clear();
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
