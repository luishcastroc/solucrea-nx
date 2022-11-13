import { NgIf } from '@angular/common';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'empty-layout',
  template: `<div class="flex w-full flex-auto flex-col">
    <!-- Content -->
    <div class="flex flex-auto flex-col">
      <!-- *ngIf="true" hack is required here for router-outlet to work correctly.
             Otherwise, layout changes won't be registered and the view won't be updated! -->
      <router-outlet *ngIf="true"></router-outlet>
    </div>
  </div>`,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet, NgIf],
})
export class EmptyLayoutComponent implements OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
