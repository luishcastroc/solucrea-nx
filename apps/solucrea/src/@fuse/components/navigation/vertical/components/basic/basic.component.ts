import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation/vertical/vertical.component';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import {
  RouterLink,
  RouterLinkActive,
  RouterLinkWithHref,
} from '@angular/router';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VerifyRoleDirective } from 'app/core/auth';

@Component({
  selector: 'fuse-vertical-navigation-basic-item',
  templateUrl: './basic.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkWithHref,
    RouterLinkActive,
    NgClass,
    NgIf,
    MatIconModule,
    VerifyRoleDirective,
    NgTemplateOutlet,
  ],
})
export class FuseVerticalNavigationBasicItemComponent
  implements OnInit, OnDestroy
{
  @Input()
  item!: FuseNavigationItem;
  @Input()
  name!: string;

  private _fuseVerticalNavigationComponent!: FuseVerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _fuseNavigationService = inject(FuseNavigationService);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this._fuseVerticalNavigationComponent =
      this._fuseNavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._fuseVerticalNavigationComponent.onRefreshed
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this._changeDetectorRef.markForCheck();
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
}
