import { Observable } from 'rxjs';
import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';
import { CajasState } from './../_store/caja.state';
import { HotToastService } from '@ngneat/hot-toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store, Actions, Select } from '@ngxs/store';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GetAllSucursales } from '../_store/caja.actions';
import { createMask } from '@ngneat/input-mask';

@Component({
    selector: 'app-caja-detail',
    templateUrl: './caja-detail.component.html',
    styleUrls: ['./caja-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaDetailComponent implements OnInit {
    @Select(CajasState.sucursales) sucursales$: Observable<ISucursalReturnDto[]>;
    cajaForm: FormGroup;
    currencyInputMask = createMask({
        alias: 'numeric',
        groupSeparator: ',',
        digits: 2,
        digitsOptional: false,
        prefix: '$ ',
        placeholder: '0',
        autoUnmask: true,
    });

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _changeDetectorRef: ChangeDetectorRef,
        private _toast: HotToastService
    ) {}

    ngOnInit(): void {
        this._store.dispatch(new GetAllSucursales());
        this.cajaForm = this.createCajaForm();
    }

    /**
     * Function get back to caja main page
     *
     *
     */
    back() {
        this._store.dispatch(new Navigate(['/caja']));
    }

    /**
     * Create CajaForm
     *
     */
    createCajaForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            saldoInicial: ['', Validators.required],
            fechaApertura: ['', Validators.required],
            sucursal: ['', Validators.required],
            observaciones: [''],
        });
    }
}
