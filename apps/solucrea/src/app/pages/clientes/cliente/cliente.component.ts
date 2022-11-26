import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { TipoDireccion } from '@prisma/client';
import {
  CreateDireccionDto,
  IActividadEconomicaReturnDto,
  IClienteReturnDto,
  IColonias,
  IDireccion,
  IDireccionUpdateDto,
  ITrabajoDto,
} from 'api/dtos/';
import { EditMode } from 'app/core/models';
import { CanDeactivateComponent } from 'app/core/models/can-deactivate.model';
import {
  Add,
  ClearClientesState,
  ClientesState,
  Edit,
  GetColonias,
  GetConfig,
  IColoniasState,
  RemoveColonia,
  SelectActividadEconomica,
  SelectCliente,
} from 'app/pages/clientes/_store';
import { SharedService } from 'app/shared';
import { isEqual } from 'lodash';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

import { ClientesService } from '../_services/clientes.service';
import { IConfig } from '../models/config.model';
import { curpValidator, rfcValidator } from '../validators/custom-clientes.validators';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatLuxonDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    InputMaskModule,
    AsyncPipe,
    NgClass,
    NgIf,
    NgFor,
  ],
})
export class ClienteComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  @ViewChild('stepper')
  private myStepper!: MatStepper;

  config$!: Observable<IConfig | undefined>;
  loading$!: Observable<boolean>;
  editMode$!: Observable<EditMode>;
  colonias$!: Observable<IColoniasState[]>;
  selectedCliente$!: Observable<IClienteReturnDto | undefined>;
  selectedActividadEconomica$!: Observable<IActividadEconomicaReturnDto | undefined>;

  ubicacion: IColoniasState[] = [];
  ubicacionTrabajo!: IColoniasState;
  clienteForm!: UntypedFormGroup;
  trabajoForm!: UntypedFormGroup;
  editMode!: EditMode;
  deletedAddresses: Array<any> = [];
  phoneInputMask = createMask({
    mask: '(999)-999-99-99',
    autoUnmask: true,
  });
  yearsInputMask = createMask({
    alias: 'decimal',
    allowMinus: false,
    digits: 0,
  });
  capsInputMAsk = createMask({ casing: 'upper' });
  titleInputMask = createMask({ casing: 'title' });
  loading = false;

  private _store = inject(Store);
  private _formBuilder = inject(UntypedFormBuilder);
  private _actions$ = inject(Actions);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toast = inject(HotToastService);
  private _clienteService = inject(ClientesService);
  private _route = inject(ActivatedRoute);
  private _sharedService = inject(SharedService);
  private _cdr = inject(ChangeDetectorRef);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    this.config$ = this._store.select(ClientesState.config);
    this.loading$ = this._store.select(ClientesState.loading);
    this.editMode$ = this._store.select(ClientesState.editMode);
    this.colonias$ = this._store.select(ClientesState.colonias);
    this.selectedCliente$ = this._store.select(ClientesState.selectedCliente);
    this.selectedActividadEconomica$ = this._store.select(ClientesState.selectedActividadEconomica);
  }

  get direcciones() {
    return this.clienteForm.get('direcciones') as UntypedFormArray;
  }

  get actividadEconomica() {
    return this.trabajoForm.get('actividadEconomica') as UntypedFormControl;
  }

  get cpTrabajo() {
    return this.trabajoForm.get('direccion')?.get('codigoPostal') as UntypedFormControl;
  }

  get ciudadTrabajo() {
    return this.trabajoForm.get('direccion')?.get('ciudad') as UntypedFormControl;
  }

  get estadoTrabajo() {
    return this.trabajoForm.get('direccion')?.get('estado') as UntypedFormControl;
  }

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
    this.colonias$.pipe(takeUntil(this._unsubscribeAll)).subscribe(ubicacion => {
      if (ubicacion.length > 0) {
        ubicacion.forEach((direccion, i) => {
          if (direccion.tipoDireccion === 'CLIENTE') {
            if (this.direcciones.controls[i].get('ciudad')?.value !== direccion.ubicacion.ciudad.descripcion) {
              this.direcciones.controls[i].get('ciudad')?.patchValue(direccion.ubicacion.ciudad.descripcion);
            }
            if (this.direcciones.controls[i].get('estado')?.value !== direccion.ubicacion.estado.descripcion) {
              this.direcciones.controls[i].get('estado')?.patchValue(direccion.ubicacion.estado.descripcion);
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
      .subscribe((selectedActividadEconomica: IActividadEconomicaReturnDto | undefined) => {
        if (selectedActividadEconomica) {
          this.trabajoForm.get('montoMinimo')?.patchValue(Number(selectedActividadEconomica.montoMin));
          this.trabajoForm.get('montoMaximo')?.patchValue(Number(selectedActividadEconomica.montoMax));
        }
      });
  }

  /**
   * Function to subscribe to actions
   *
   *
   */
  subscribeToActions(): void {
    this._actions$
      .pipe(takeUntil(this._unsubscribeAll), ofActionCompleted(Add, Edit, GetColonias))
      .subscribe(result => {
        const { error, successful } = result.result;
        const { action } = result;
        this.loading = false;
        this.clienteForm.enable();
        this.trabajoForm.enable();
        this._cdr.markForCheck();
        if (error) {
          const message = `${(error as HttpErrorResponse)['error'].message}`;
          this._toast.error(message, {
            duration: 4000,
            position: 'bottom-center',
          });
        }
        if (successful) {
          // we enable the form
          this.clienteForm.markAsPristine();
          this.trabajoForm.markAsPristine();
          this.clienteForm.markAsUntouched();
          this.trabajoForm.markAsUntouched();

          if (action instanceof Add) {
            const message = 'Cliente salvado exitosamente.';
            this._toast.success(message, {
              duration: 4000,
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
          } else {
            this.disableCiudadAndEstado();
          }
        }
      });
  }

  /**
   *
   * Function to subscribe to editMode
   *
   */
  subscribeToEditMode(id: string | null): void {
    this.editMode$
      .pipe(
        switchMap(editMode => {
          this.editMode = editMode;
          if (editMode === 'edit' && id) {
            this._store.dispatch(new SelectCliente(id));
            return this.selectedCliente$;
          }
          return of(null);
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((selectedCliente: IClienteReturnDto | undefined | null) => {
        if (selectedCliente) {
          const { direcciones, trabajo } = selectedCliente;

          // Filling the direccion field and calling the codigoPostal service
          direcciones.forEach((direccion, i) => {
            if (i > 0) {
              this.addDireccionesField();
            }
            this.direcciones.controls[i].get('id')?.setValue(direccion.id);
            this.direcciones.controls[i].get('codigoPostal')?.setValue(direccion.colonia.codigoPostal);
            this.getColonias(direccion.colonia.codigoPostal, i, 'CLIENTE');
            this.direcciones.controls[i].get('colonia')?.setValue(direccion.colonia.id);
          });

          // putting values into the Cliente form
          this.clienteForm.patchValue({
            ...selectedCliente,
            genero: selectedCliente.genero.id,
            estadoCivil: selectedCliente.estadoCivil.id,
            escolaridad: selectedCliente.escolaridad.id,
            tipoDeVivienda: selectedCliente.tipoDeVivienda.id,
          });

          // putting values into the Trabajo
          this.trabajoForm.patchValue({
            ...selectedCliente.trabajo,
            actividadEconomica: trabajo.actividadEconomica.id,
            direccion: {
              ...trabajo.direccion,
              colonia: trabajo.direccion.colonia.id,
              codigoPostal: trabajo.direccion.colonia.codigoPostal,
            },
          });

          // calling the service to fill the colonia on Trabajo
          this.getColonias(trabajo.direccion.colonia.codigoPostal, selectedCliente.direcciones.length, 'TRABAJO');

          if (this.actividadEconomica.value) {
            this.selectActividadEconomica(this.actividadEconomica.value);
          }

          this._changeDetectorRef.markForCheck();
        }
      });
  }

  /**
   * Create ClienteForm
   *
   */
  createClienteForm(): UntypedFormGroup {
    return this._formBuilder.group({
      id: [''],
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
      multiplos: [0],
      numeroCreditosCrecer: [''],
      porcentajeDePagos: [0],
      porcentajeDeMora: [0],
      direcciones: this._formBuilder.array([]),
    });
  }

  /**
   * Create TrabajoForm
   *
   */
  createTrabajoForm(): UntypedFormGroup {
    return this._formBuilder.group({
      nombre: ['', Validators.required],
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
      id: [''],
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
   * @param id
   */
  removeDireccionesField(index: number, id: string): void {
    // obtener form array para direcciones
    const direccionesFormArray = this.clienteForm.get('direcciones') as UntypedFormArray;

    // Remove the phone number field
    direccionesFormArray.removeAt(index);
    this.removeColonia(index);
    if (id) {
      this.deletedAddresses.push({ id });
    }

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
  compareColonias(id: string, colonia2: IColonias): boolean {
    return id && colonia2 && id === colonia2.id ? true : false;
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
    this.loading = true;
    if (this.editMode === 'new') {
      this.clienteForm.disable();
      this.trabajoForm.disable();
      const cliente = this._clienteService.prepareClienteCreateObject(this.clienteForm, this.trabajoForm);
      this._store.dispatch(new Add(cliente));
    } else {
      let cliente = this._sharedService.getDirtyValues(this.clienteForm);
      const trabajo: ITrabajoDto = this._sharedService.getDirtyValues(this.trabajoForm);
      let direcciones: IDireccionUpdateDto = {};

      if (trabajo) {
        cliente = { ...cliente, trabajo };
      }

      if (cliente.direcciones && Object.values(cliente.direcciones).length > 0) {
        const create = Object.values(cliente.direcciones as IDireccion[])
          .filter((direccion: IDireccion) => !direccion.id)
          .map((direccion: IDireccion) => {
            const { id, ...rest } = direccion;
            const direccionReturn: CreateDireccionDto = {
              ...rest,
              tipo: 'CLIENTE',
            } as CreateDireccionDto;
            return direccionReturn;
          });
        const update = Object.values(cliente.direcciones as IDireccion[]).filter(
          (direccion: IDireccion) => direccion.id
        );

        // if there's a record that needs to be created add it to the object
        if (create.length > 0) {
          direcciones = { ...direcciones, create };
        }

        // // if there's a records that needs to be updated add it to the object
        if (update.length > 0) {
          direcciones = { ...direcciones, update: update as IDireccion[] };
        }

        // if there are deleted items add them so they can be updated
        if (this.deletedAddresses.length > 0) {
          direcciones = {
            ...direcciones,
            deleteDireccion: this.deletedAddresses,
          };
        }
        cliente = { ...cliente, direcciones };
      } else if (this.deletedAddresses.length > 0) {
        // if the object direcciones doesn't exist in the update but there are addressess to be deleted,
        // create the array and add the elements to delete
        direcciones = {
          ...direcciones,
          deleteDireccion: this.deletedAddresses,
        };
        cliente = { ...cliente, direcciones };
      }

      this._store.dispatch(new Edit(cliente.id, cliente));
    }
  }

  /**
   * disableCiudadAndEstado:
   *
   * function to disable Estado and Ciudad form elements
   */
  disableCiudadAndEstado(): void {
    this.direcciones.controls.forEach(element => {
      element.get('ciudad')?.disable();
      element.get('estado')?.disable();
    });
    (this.trabajoForm.get('direccion') as UntypedFormGroup).get('ciudad')?.disable();
    (this.trabajoForm.get('direccion') as UntypedFormGroup).get('estado')?.disable();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this._store.dispatch(new ClearClientesState());
  }
}
