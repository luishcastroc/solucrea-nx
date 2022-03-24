import { ICreditoReturnDto } from 'api/dtos';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { CreditosState } from '../_store';

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
    constructor(private _store: Store, private location: Location) {}

    ngOnInit(): void {}

    /**
     * Volver a Clientes
     */
    back(): void {
        this.location.back();
    }
}
