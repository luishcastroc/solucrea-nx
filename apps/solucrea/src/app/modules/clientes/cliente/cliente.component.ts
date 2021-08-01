import { GetColonias } from './../_store/clientes.actions';
import { rfcValidator } from './../validators/custom-clientes.validators';
import { curpValidator } from '../validators/custom-clientes.validators';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, Store } from '@ngxs/store';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteComponent implements OnInit {
    clienteForm: FormGroup;
    get direcciones() {
        return this.clienteForm.get('direcciones') as FormArray;
    }
    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _actions$: Actions,
        private _fuseAlertService: FuseAlertService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.clienteForm = this._formBuilder.group({
            nombre: ['', Validators.required],
            apellidos: ['', Validators.required],
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

        this.addDireccionesField();
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
        // Create an empty phone number form group
        const direccionesFormGroup = this._formBuilder.group({
            tipo: ['CLIENTE'],
            calle: ['', Validators.required],
            numero: ['', Validators.required],
            cruzamientos: [''],
            codigoPostal: ['', Validators.required],
            colonia: ['', Validators.required],
            ciudad: ['', Validators.required],
            estado: ['', Validators.required],
        });

        // agregar direcciones form group tal array direcciones
        (this.clienteForm.get('direcciones') as FormArray).push(
            direccionesFormGroup
        );

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
        const direccionesFormArray = this.clienteForm.get(
            'direcciones'
        ) as FormArray;

        // Remove the phone number field
        direccionesFormArray.removeAt(index);

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
    getColonias(cp: string): void {
        this._store.dispatch(new GetColonias(cp));
    }
}
