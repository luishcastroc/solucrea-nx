import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';

import { ClearCreditosState } from 'app/pages/creditos/_store';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-creditos',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class CreditosComponent implements OnInit, OnDestroy {
  @ViewChild('drawer')
  drawer!: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  private _store = inject(Store);
  private _fuseMediaWatcherService = inject(FuseMediaWatcherService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

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
    this._store.dispatch(new ClearCreditosState());
  }
}
