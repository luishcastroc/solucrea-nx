import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation/vertical/vertical.component';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { CommonModule } from '@angular/common';
import { FuseVerticalNavigationBasicItemComponent } from '../basic/basic.component';
import { FuseVerticalNavigationCollapsableItemComponent } from '../collapsable/collapsable.component';
import { FuseVerticalNavigationDividerItemComponent } from '../divider/divider.component';
import { FuseVerticalNavigationSpacerItemComponent } from '../spacer/spacer.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'fuse-vertical-navigation-group-item',
  templateUrl: './group.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FuseVerticalNavigationBasicItemComponent,
    forwardRef(() => FuseVerticalNavigationCollapsableItemComponent),
    FuseVerticalNavigationDividerItemComponent,
    FuseVerticalNavigationSpacerItemComponent,
    MatIconModule,
  ],
  standalone: true,
})
export class FuseVerticalNavigationGroupItemComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  /* eslint-enable @typescript-eslint/naming-convention */
  @Input()
  autoCollapse!: boolean;
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
    this._fuseVerticalNavigationComponent = this._fuseNavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._fuseVerticalNavigationComponent.onRefreshed.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
