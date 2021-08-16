import { RemoveColonia } from './../_store/clientes.actions';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, Select, Store } from '@ngxs/store';
import { TipoDireccion } from '@prisma/client';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GetColonias, GetConfig } from '../_store/clientes.actions';
import { ClientesState } from '../_store/clientes.state';
import { IConfig } from '../models/config.model';
import { curpValidator, rfcValidator } from '../validators/custom-clientes.validators';
import { IColoniasState } from './../_store/clientes.model';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteComponent implements OnInit, OnDestroy {
    @Select(ClientesState.config) config$: Observable<IConfig>;
    @Select(ClientesState.loading) loading$: Observable<boolean>;
    @Select(ClientesState.colonias) colonias$: Observable<IColoniasState[]>;
    ubicacion: IColoniasState[] = [];
    ubicacionTrabajo: IColoniasState;

    clienteForm: FormGroup;
    trabajoForm: FormGroup;
    get direcciones() {
        return this.clienteForm.get('direcciones') as FormArray;
    }

    get cpTrabajo() {
        return this.trabajoForm.get('direccion').get('codigoPostal') as FormControl;
    }

    get ciudadTrabajo() {
        return this.trabajoForm.get('direccion').get('ciudad') as FormControl;
    }

    get estadoTrabajo() {
        return this.trabajoForm.get('direccion').get('estado') as FormControl;
    }

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._store.dispatch(new GetConfig());
        this.clienteForm = this.createClienteForm();
        this.addDireccionesField();
        this.trabajoForm = this.createTrabajoForm();
        this.colonias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((ubicacion) => {
            if (ubicacion.length > 0) {
                ubicacion.forEach((direccion, i) => {
                    if (direccion.tipoDireccion === 'CLIENTE') {
                        this.direcciones.controls[i].get('ciudad').patchValue(direccion.ubicacion.ciudad.descripcion);
                        this.direcciones.controls[i].get('estado').patchValue(direccion.ubicacion.estado.descripcion);
                        this.ubicacion.push(direccion);
                    } else if (direccion.tipoDireccion === 'TRABAJO') {
                        this.ciudadTrabajo.patchValue(direccion.ubicacion.ciudad.descripcion);
                        this.estadoTrabajo.patchValue(direccion.ubicacion.estado.descripcion);
                        this.ubicacionTrabajo = direccion;
                    }
                });
            }
        });
    }

    /**
     * Create ClienteForm
     *
     */
    createClienteForm(): FormGroup {
        return this._formBuilder.group({
            nombre: ['', Validators.required],
            apellidoPaterno: ['', Validators.required],
            apellidoMaterno: ['', Validators.required],
            fechaDeNacimiento: [null, Validators.required],
            genero: ['', Validators.required],
            estadoCivil: ['', Validators.required],
            escolaridad: ['', Validators.required],
            tipoDeVivienda: ['', Validators.required],
            rfc: ['', [Validators.required, rfcValidator()]],
            curp: ['', [Validators.required, curpValidator()]],
            telefono1: ['', [Validators.required]],
            telefono2: [''],
            direcciones: this._formBuilder.array([]),
        });
    }

    /**
     * Create TrabajoForm
     *
     */
    createTrabajoForm(): FormGroup {
        return this._formBuilder.group({
            nombre: ['', Validators.required],
            direccion: this._formBuilder.group({
                tipo: ['TRABAJO'],
                calle: ['', Validators.required],
                numero: ['', Validators.required],
                cruzamientos: [''],
                codigoPostal: ['', Validators.required],
                colonia: ['', Validators.required],
                ciudad: [{ value: '', disabled: true }, Validators.required],
                estado: [{ value: '', disabled: true }, Validators.required],
            }),
            telefono: ['', Validators.required],
            antiguedad: [null, Validators.required],
            actividadEconomica: ['', Validators.required],
        });
    }

    /**
     * Volver a Clientes
     */
    back(): void {
        this._store.dispatch(new Navigate(['/clientes/']));
    }

    /**
     * Agregar un campo direcciones vacio
     */
    addDireccionesField(): void {
        // Create an empty address form group
        const direccionesFormGroup = this._formBuilder.group({
            tipo: ['CLIENTE'],
            calle: ['', Validators.required],
            numero: ['', Validators.required],
            cruzamientos: [''],
            codigoPostal: ['', Validators.required],
            colonia: ['', Validators.required],
            ciudad: [{ value: '', disabled: true }, Validators.required],
            estado: [{ value: '', disabled: true }, Validators.required],
        });

        // agregar direcciones form group tal array direcciones
        (this.clienteForm.get('direcciones') as FormArray).push(direccionesFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remover el campo direcciones
     *
     * @param index
     */
    removeDireccionesField(index: number): void {
        // obtener form array para direcciones
        const direccionesFormArray = this.clienteForm.get('direcciones') as FormArray;

        // Remove the phone number field
        direccionesFormArray.removeAt(index);
        this.removeColonia(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * funcion Track by para ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * function to call the action GetColonias
     *
     * @param cp
     */
    getColonias(cp: string, index: number, tipo: TipoDireccion): void {
        this._store.dispatch(new GetColonias(cp, index, tipo));
    }

    /**
     * function to remove colonia from state
     *
     * @param index
     */
    removeColonia(index: number): void {
        this._store.dispatch(new RemoveColonia(index));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
