import { AsyncPipe, I18nPluralPipe, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Logout } from 'app/core/auth';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'auth-sign-out',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [I18nPluralPipe, AsyncPipe, RouterLinkWithHref, NgIf],
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
  countdown: number = 5;
  countdownMapping: any = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '=1': '# second',
    // eslint-disable-next-line quote-props
    other: '# seconds',
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _store = inject(Store);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Sign out
    this._store.dispatch(new Logout());

    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._store.dispatch(new Navigate(['sign-in']));
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--)
      )
      .subscribe();
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
