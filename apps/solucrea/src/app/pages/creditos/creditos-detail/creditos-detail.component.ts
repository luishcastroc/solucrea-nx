import { StepperOrientation } from '@angular/cdk/stepper';
import { AsyncPipe, Location, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngxs/store';
import { EditMode } from 'app/core/models';
import { ClearCreditosDetails } from 'app/pages/creditos/_store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CreditosInfoComponent } from '../creditos-info/creditos-info.component';
import { CreditosNewComponent } from '../creditos-new/creditos-new.component';
import { CreditosPagoComponent } from '../creditos-pago/creditos-pago.component';
import { CreditosPagosListComponent } from '../creditos-pagos-list/creditos-pagos-list.component';
import { CreditosSelectors } from '../_store/creditos.selectors';

import { CreditosState } from '../_store/creditos.state';

@Component({
  selector: 'app-creditos-detail',
  templateUrl: './creditos-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    CreditosInfoComponent,
    CreditosPagoComponent,
    CreditosPagosListComponent,
    CreditosNewComponent,
    AsyncPipe,
  ],
})
export class CreditosDetailComponent implements OnInit, OnDestroy {
  editMode$!: Observable<EditMode>;
  clienteId!: string | null;
  orientation: StepperOrientation = 'horizontal';

  private _store = inject(Store);
  private location = inject(Location);
  private _route = inject(ActivatedRoute);
  private _cdr = inject(ChangeDetectorRef);
  private _fuseMediaWatcherService = inject(FuseMediaWatcherService);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.editMode$ = this._store.select(CreditosSelectors.slices.editMode);
  }

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
