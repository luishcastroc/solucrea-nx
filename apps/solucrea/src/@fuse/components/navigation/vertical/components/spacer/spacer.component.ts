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
import { NgClass } from '@angular/common';

@Component({
  selector: 'fuse-vertical-navigation-spacer-item',
  template: `<div
    class="fuse-vertical-navigation-item-wrapper"
    [ngClass]="$any(item.classes?.wrapper)"></div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class FuseVerticalNavigationSpacerItemComponent
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
