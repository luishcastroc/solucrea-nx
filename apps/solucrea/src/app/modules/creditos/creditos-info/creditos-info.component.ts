import { IAmortizacion, ICreditoReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { CreditosState, ModeCredito, SelectCredito } from '../_store';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-creditos-info',
    templateUrl: './creditos-info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosInfoComponent implements OnInit {
    @Select(CreditosState.loading)
    loading$!: Observable<boolean>;
    @Select(CreditosState.selectedCredito)
    selectedCredito$!: Observable<ICreditoReturnDto>;
    creditoId!: string | null;
    constructor(private _store: Store, private location: Location, private _route: ActivatedRoute) {}

    ngOnInit(): void {
        this.creditoId = this._route.snapshot.paramMap.get('creditoId');
        if (this.creditoId) {
            this._store.dispatch(new SelectCredito(this.creditoId));
        }
    }

    /**
     * Volver a Clientes
     */
    back(): void {
        this.location.back();
    }

    goToPago() {
        this._store.dispatch(new ModeCredito('pago'));
    }
}
