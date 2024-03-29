import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Data, RouterOutlet } from '@angular/router';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngxs/store';
import { Usuario } from '@prisma/client';
import { InitialData } from 'app/app.types';
import { AuthStateSelectors } from 'app/core/auth';
import { UserMenuComponent } from 'app/layout/common/user-menu/user-menu.component';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'classy-layout',
  templateUrl: './classy.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FuseVerticalNavigationComponent, UserMenuComponent, MatIconModule, RouterOutlet, NgIf, AsyncPipe],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
  data!: InitialData;
  isScreenSmall!: boolean;
  readonly user$: Observable<Usuario | undefined>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _activatedRoute = inject(ActivatedRoute);
  private _fuseMediaWatcherService = inject(FuseMediaWatcherService);
  private _fuseNavigationService = inject(FuseNavigationService);
  private _store = inject(Store);

  /**
   * Constructor
   */
  constructor() {
    this.user$ = this._store.select(AuthStateSelectors.slices.user);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the resolved route
    this._activatedRoute.data.subscribe((data: Data) => {
      this.data = data['initialData'];
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
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
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
