import { tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, Select, Store } from '@ngxs/store';
import { IColoniaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models/edit-mode.type';
import { AjustesState } from 'app/modules/ajustes/_store/ajustes.state';
import { Observable } from 'rxjs';

import { GetColonias } from '../../_store/ajustes-sucursales.actions';
import { AjustesSucursalService } from './../../_services/ajustes-sucursal.service';

@Component({
    selector: 'app-sucursales-details',
    templateUrl: './sucursales-details.component.html',
    styleUrls: ['./sucursales-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalesDetailsComponent implements OnInit {
    @Select(AjustesState.loading) loading$: Observable<boolean>;
    @Select(AjustesState.editMode) editMode$: Observable<EditMode>;
    @Select(AjustesState.colonias) colonias$: Observable<IColoniaReturnDto>;

    sucursalForm: FormGroup;
    editMode: EditMode;
    coloniasTemp$: Observable<IColoniaReturnDto>;

    get cp() {
        return this.sucursalForm.get('direccion').get('codigoPostal') as FormControl;
    }

    get ciudad() {
        return this.sucursalForm.get('direccion').get('ciudad') as FormControl;
    }

    get estado() {
        return this.sucursalForm.get('direccion').get('estado') as FormControl;
    }

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _changeDetectorRef: ChangeDetectorRef,
        private _toast: HotToastService,
        private _sucursalesService: AjustesSucursalService,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');
        this.sucursalForm = this.createSucursalForm();
        this.coloniasTemp$ = this.colonias$.pipe(
            tap(({ ciudad, estado }: IColoniaReturnDto) => {
                if (ciudad && estado) {
                    this.ciudad.patchValue(ciudad.descripcion);
                    this.estado.patchValue(estado.descripcion);
                }
            })
        );
    }

    /**
     * Create SucursalForm
     *
     */
    createSucursalForm(): FormGroup {
        return this._formBuilder.group({
            id: [''],
            nombre: ['', Validators.required],
            telefono: ['', Validators.required],
            direccion: this._formBuilder.group({
                id: [''],
                tipo: ['TRABAJO'],
                calle: ['', Validators.required],
                numero: ['', Validators.required],
                cruzamientos: [''],
                codigoPostal: ['', Validators.required],
                colonia: ['', Validators.required],
                ciudad: [{ value: '', disabled: true }, Validators.required],
                estado: [{ value: '', disabled: true }, Validators.required],
            }),
        });
    }

    /**
     * function to call the action GetColonias
     *
     * @param cp
     */
    getColonias(cp: string): void {
        this._store.dispatch(new GetColonias(cp));
    }

    /**
     * Function to save cliente into the database
     *
     *
     */
    saveSucursal(): void {
        console.log(this.sucursalForm.value);
    }
}
