import { CreditosState } from './../_store/creditos.state';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Select, Store } from '@ngxs/store';
import { ClearCreditosDetails, GetCreditosConfiguration } from 'app/modules/creditos/_store/';
import { Subject, takeUntil, Observable } from 'rxjs';
import { EditMode } from 'app/core/models';

@Component({
    selector: 'app-creditos-detail',
    templateUrl: './creditos-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosDetailComponent implements OnInit, OnDestroy {
    @Select(CreditosState.editMode)
    editMode$!: Observable<EditMode>;
    clienteId!: string | null;
    orientation: StepperOrientation = 'horizontal';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private location: Location,
        private _route: ActivatedRoute,
        private _cdr: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    ngOnInit(): void {
        this.clienteId = this._route.snapshot.paramMap.get('clienteId');

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('md')) {
                    this.orientation = 'horizontal';
                } else {
                    this.orientation = 'vertical';
                }

                // Mark for check
                this._cdr.markForCheck();
            });
    }

    /**
     * Volver a Clientes
     */
    back(): void {
        this.location.back();
    }

    ngOnDestroy(): void {
        this._store.dispatch(new ClearCreditosDetails());
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
