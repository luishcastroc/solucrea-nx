import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';

import { ClearClientesState } from 'app/modules/clientes/_store';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClientesComponent implements OnInit, OnDestroy {
    @ViewChild('drawer')
    drawer!: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _store: Store,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearClientesState());
    }
}
