import { takeUntil } from 'rxjs/operators';
import { Usuario } from '@prisma/client';
import { Observable, Subject } from 'rxjs';
import { AuthState } from 'app/core/auth/store/auth.state';
import { Select } from '@ngxs/store';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesAccountComponent implements OnInit {
    @Select(AuthState.user) user$: Observable<Usuario>;

    accountForm: FormGroup;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(private _formBuilder: FormBuilder) {
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.accountForm = this._formBuilder.group({
            nombre: ['Luis'],
            apellido: ['Castro'],
            nombreUsuario: ['luish.castroc'],
        });

        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
            if (user) {
                this.accountForm.patchValue(user);
            }
        });
    }
}
