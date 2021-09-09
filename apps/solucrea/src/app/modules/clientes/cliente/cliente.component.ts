import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { TipoDireccion } from '@prisma/client';
import { IActividadEconomicaReturnDto, IClienteReturnDto, IColonias, IDireccionesReturnDto } from 'api/dtos/';
import { CanDeactivateComponent } from 'app/core/models/can-deactivate.model';
import { isEqual } from 'lodash';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { EditMode } from '../../../core/models/edit-mode.type';
import {
    Add,
    ClearClientesState,
    GetColonias,
    GetConfig,
    RemoveColonia,
    SelectActividadEconomica,
    SelectCliente,
} from '../_store/clientes.actions';
import { IColoniasState } from '../_store/clientes.model';
import { ClientesState } from '../_store/clientes.state';
import { ClientesService } from '../clientes.service';
import { IConfig } from '../models/config.model';
import { curpValidator, rfcValidator } from '../validators/custom-clientes.validators';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteComponent implements OnInit, OnDestroy, CanDeactivateComponent {
    @Select(ClientesState.config) config$: Observable<IConfig>;
    @Select(ClientesState.loading) loading$: Observable<boolean>;
    @Select(ClientesState.editMode) editMode$: Observable<EditMode>;
    @Select(ClientesState.colonias) colonias$: Observable<IColoniasState[]>;
    @Select(ClientesState.selectedCliente) selectedCliente$: Observable<IClienteReturnDto>;
    @Select(ClientesState.selectedActividadEconomica)
    selectedActividadEconomica$: Observable<IActividadEconomicaReturnDto>;

    @ViewChild('stepper') private myStepper: MatStepper;

    ubicacion: IColoniasState[] = [];
    ubicacionTrabajo: IColoniasState;
    clienteForm: FormGroup;
    trabajoForm: FormGroup;
    editMode: EditMode;
    savedDirecciones: IDireccionesReturnDto[];

    get direcciones() {
        return this.clienteForm.get('direcciones') as FormArray;
    }

    get actividadEconomica() {
        return this.trabajoForm.get('actividadEconomica') as FormControl;
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
        private _changeDetectorRef: ChangeDetectorRef,
        private _toast: HotToastService,
        private _clienteService: ClientesService,
        private _route: ActivatedRoute
    ) {}

    @HostListener('window:beforeunload', ['$event'])
    canDeactivateWindow($event: Event) {
        $event.returnValue = true;
        return;
    }

    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');
        // Getting initial configuration
        this._store.dispatch(new GetConfig());
        // Generate the cliente form
        this.clienteForm = this.createClienteForm();
        // Add the first address
        this.addDireccionesField();
        // Generate the Trabajo form
        this.trabajoForm = this.createTrabajoForm();
        //Subscribe to colonias and actividades
        this.subscribeToColonias();
        this.subscribeToSelectedActividadEconomica();
        this.subscribeToActions();
        // Getting the component mode
        this.subscribeToEditMode(id);
    }

    /**
     * Function to subscribe to colonias
     *
     *
     */
    subscribeToColonias(): void {
        this.colonias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((ubicacion) => {
            if (ubicacion.length > 0) {
                ubicacion.forEach((direccion, i) => {
                    if (direccion.tipoDireccion === 'CLIENTE') {
                        if (
                            this.direcciones.controls[i].get('ciudad').value !== direccion.ubicacion.ciudad.descripcion
                        ) {
                            this.direcciones.controls[i]
                                .get('ciudad')
                                .patchValue(direccion.ubicacion.ciudad.descripcion);
                        }
                        if (
                            this.direcciones.controls[i].get('estado').value !== direccion.ubicacion.estado.descripcion
                        ) {
                            this.direcciones.controls[i]
                                .get('estado')
                                .patchValue(direccion.ubicacion.estado.descripcion);
                        }
                        if (!isEqual(this.ubicacion[i], direccion)) {
                            this.ubicacion[i] = direccion;
                        }
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
     * Function to subscribe to selectedActividadEconomica
     *
     *
     */
    subscribeToSelectedActividadEconomica(): void {
        this.selectedActividadEconomica$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((selectedActividadEconomica: IActividadEconomicaReturnDto) => {
                if (selectedActividadEconomica) {
                    this.trabajoForm.get('montoMinimo').patchValue(Number(selectedActividadEconomica.montoMin));
                    this.trabajoForm.get('montoMaximo').patchValue(Number(selectedActividadEconomica.montoMax));
                }
            });
    }

    /**
     * Function to subscribe to actions
     *
     *
     */
    subscribeToActions(): void {
        this._actions$.pipe(takeUntil(this._unsubscribeAll), ofActionCompleted(Add)).subscribe((action) => {
            const { error, successful } = action.result;
            if (error) {
                const message = `${error['error'].message}`;
                this._toast.error(message, {
                    duration: 5000,
                    position: 'bottom-center',
                });
            }
            if (successful) {
                const message = 'Cliente salvado exitosamente.';
                this._toast.success(message, {
                    duration: 5000,
                    position: 'bottom-center',
                });
                // we clear the forms
                this.clienteForm.reset();
                if (this.direcciones.length > 1) {
                    for (let i = 1; i < this.direcciones.length; i++) {
                        this.direcciones.removeAt(i);
                    }
                }
                this.trabajoForm.reset();
                // we reset the stepper
                this.myStepper.reset();
            }
            // we enable the form
            this.clienteForm.enable();
            this.trabajoForm.enable();
        });
    }

    /**
     *
     * Function to subscribe to editMode
     *
     */
    subscribeToEditMode(id: string): void {
        this.editMode$
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((editMode) => {
                    this.editMode = editMode;
                    if (editMode === 'edit' && id) {
                        this._store.dispatch(new SelectCliente(id));
                        return this.selectedCliente$;
                    }
                    return of(null);
                })
            )
            .subscribe((selectedCliente: IClienteReturnDto) => {
                if (selectedCliente) {
                    const { direcciones, trabajo } = selectedCliente;

                    this.savedDirecciones = direcciones;
                    // Filling the direccion field and calling the codigoPostal service
                    direcciones.forEach((direccion, i) => {
                        if (i > 0) {
                            this.addDireccionesField();
                        }
                        this.direcciones.controls[i].get('codigoPostal').setValue(direccion.colonia.codigoPostal);
                        this.getColonias(direccion.colonia.codigoPostal, i, 'CLIENTE');
                        this.direcciones.controls[i].get('colonia').setValue(direccion.colonia.id);
                    });

                    // putting values into the Cliente form
                    this.clienteForm.patchValue({
                        ...selectedCliente,
                        genero: selectedCliente.generoId,
                        estadoCivil: selectedCliente.estadoCivilId,
                        escolaridad: selectedCliente.escolaridadId,
                        tipoDeVivienda: selectedCliente.tipoDeViviendaId,
                    });

                    // putting values into the Trabajo
                    this.trabajoForm.patchValue({
                        ...selectedCliente.trabajo,
                        actividadEconomica: trabajo.actividadEconomicaId,
                        direccion: {
                            ...trabajo.direccion,
                            colonia: trabajo.direccion.colonia.id,
                            codigoPostal: trabajo.direccion.colonia.codigoPostal,
                        },
                    });

                    // calling the service to fill the colonia on Trabajo
                    this.getColonias(
                        trabajo.direccion.colonia.codigoPostal,
                        selectedCliente.direcciones.length,
                        'TRABAJO'
                    );

                    this.selectActividadEconomica(this.actividadEconomica.value);

                    this._changeDetectorRef.markForCheck();
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
            montoMinimo: [null, Validators.required],
            montoMaximo: [null, Validators.required],
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
        this.direcciones.push(direccionesFormGroup);

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
     *
     * Function to select one Actividad Economica
     *
     * @param id
     */
    selectActividadEconomica(id: string): void {
        this._store.dispatch(new SelectActividadEconomica(id));
    }

    /**
     *
     * Function to compare objects inside select
     *
     * @param colonia1
     * @param colonia2
     */
    compareColonias(id: string, colonia2: IColonias) {
        return id && colonia2 && id === colonia2.id;
    }

    /**
     * Fuction to determine if the forms were touch
     *
     *
     */
    canDeactivate(): boolean {
        if (this.clienteForm.dirty || this.trabajoForm.dirty) {
            return false;
        }
        return true;
    }

    /**
     * Function to save cliente into the database
     *
     *
     */
    saveCliente(): void {
        if (this.editMode === 'new') {
            this.clienteForm.disable();
            this.trabajoForm.disable();
            const cliente = this._clienteService.prepareClienteObject(this.clienteForm, this.trabajoForm);
            this._store.dispatch(new Add(cliente));
        } else {
            console.log('update: ', this.clienteForm.value);
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._store.dispatch(new ClearClientesState());
    }
}
