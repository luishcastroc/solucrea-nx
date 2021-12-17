import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IClienteReturnDto, ICreditoReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { AjustesCreditosService, AjustesSucursalService, AjustesUsuarioService } from 'app/modules/ajustes/_services';
import { GetAllCreditos } from 'app/modules/ajustes/_store';
import { ClientesService } from 'app/modules/clientes';
import { forkJoin, tap } from 'rxjs';

import { CreditosService } from '../_services/creditos.service';
import {
    ClearCreditosDetails,
    ClearCreditosState,
    GetAllCreditosCliente,
    GetClienteData,
    GetCreditosConfiguration,
    ModeCredito,
} from './creditos.actions';
import { CreditosStateModel } from './creditos.model';
import { Producto, Role } from '.prisma/client';

@State<CreditosStateModel>({
    name: 'creditos',
    defaults: {
        creditos: [],
        creditosFiltered: [],
        clienteCreditos: [],
        clienteCreditosFiltered: [],
        editMode: 'edit',
        selectedCredito: undefined,
        selectedClienteCredito: undefined,
        productos: [],
        sucursales: [],
        clientes: [],
        selectedCliente: undefined,
        colocadores: [],
        loading: false,
    },
})
@Injectable()
export class CreditosState {
    constructor(
        private _creditosService: CreditosService,
        private _ajustesCreditosService: AjustesCreditosService,
        private _ajustesSucursalesService: AjustesSucursalService,
        private _ajustesUsuarios: AjustesUsuarioService,
        private _clientesService: ClientesService
    ) {}

    @Selector()
    static editMode({ editMode }: CreditosStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static selectedCredito({ selectedCredito }: CreditosStateModel): ICreditoReturnDto | undefined {
        return selectedCredito;
    }

    @Selector()
    static loading({ loading }: CreditosStateModel): boolean {
        return loading;
    }

    @Selector()
    static creditosFiltered({ creditosFiltered }: CreditosStateModel): ICreditoReturnDto[] {
        return creditosFiltered;
    }

    @Selector()
    static creditos({ creditos }: CreditosStateModel): ICreditoReturnDto[] {
        return creditos;
    }

    @Selector()
    static creditosClienteFiltered({ clienteCreditosFiltered }: CreditosStateModel): ICreditoReturnDto[] {
        return clienteCreditosFiltered;
    }

    @Selector()
    static creditosCliente({ clienteCreditos }: CreditosStateModel): ICreditoReturnDto[] {
        return clienteCreditos;
    }

    @Selector()
    static productos({ productos }: CreditosStateModel): Producto[] {
        return productos;
    }

    @Selector()
    static clientes({ clientes }: CreditosStateModel): IClienteReturnDto[] {
        return clientes;
    }

    @Selector()
    static selectedCliente({ selectedCliente }: CreditosStateModel): IClienteReturnDto {
        return selectedCliente;
    }

    @Selector()
    static sucursales({ sucursales }: CreditosStateModel): ISucursalReturnDto[] {
        return sucursales;
    }

    @Action(GetAllCreditosCliente)
    getAllCreditosCliente(ctx: StateContext<CreditosStateModel>, { id }: GetAllCreditosCliente) {
        ctx.patchState({ loading: true });
        return this._creditosService.getCreditosCliente(id).pipe(
            tap((clienteCreditos: ICreditoReturnDto[]) => {
                const clienteCreditosFiltered = clienteCreditos.filter(
                    (credito: ICreditoReturnDto) => credito.status === 'ABIERTO'
                );
                ctx.patchState({
                    clienteCreditos,
                    clienteCreditosFiltered,
                    loading: false,
                });
            })
        );
    }

    @Action(GetAllCreditos)
    getAllCreditos(ctx: StateContext<CreditosStateModel>) {
        ctx.patchState({ loading: true });
        return this._creditosService.getCreditos().pipe(
            tap((creditos: ICreditoReturnDto[]) => {
                const creditosFiltered = creditos.filter((credito: ICreditoReturnDto) => credito.status === 'ABIERTO');
                ctx.patchState({
                    creditos,
                    creditosFiltered,
                    loading: false,
                });
            })
        );
    }

    @Action(GetCreditosConfiguration)
    getCreditosConfiguration(ctx: StateContext<CreditosStateModel>) {
        return forkJoin([
            this._ajustesCreditosService.getProductos(),
            this._ajustesSucursalesService.getSucursales(),
            this._ajustesUsuarios.getUsuariosWhere({ role: Role.COLOCADOR }),
        ]).pipe(
            tap(([productos, sucursales, colocadores]) => {
                ctx.patchState({ productos, sucursales, colocadores });
            })
        );
    }

    @Action(GetClienteData)
    getClienteData(ctx: StateContext<CreditosStateModel>, { id }: GetClienteData) {
        return this._clientesService.getCliente(id).pipe(
            tap((selectedCliente: IClienteReturnDto) => {
                ctx.patchState({
                    selectedCliente,
                });
            })
        );
    }

    @Action(ModeCredito)
    toggleEditModeCredito(ctx: StateContext<CreditosStateModel>, action: ModeCredito) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(ClearCreditosState)
    clearState(ctx: StateContext<CreditosStateModel>) {
        ctx.patchState({
            creditos: [],
            creditosFiltered: [],
            clienteCreditos: [],
            clienteCreditosFiltered: [],
            editMode: 'edit',
            selectedCredito: undefined,
            selectedClienteCredito: undefined,
            productos: [],
            sucursales: [],
            clientes: [],
            selectedCliente: undefined,
            colocadores: [],
            loading: false,
        });
    }

    @Action(ClearCreditosDetails)
    clearDetailState(ctx: StateContext<CreditosStateModel>) {
        ctx.patchState({
            productos: [],
            sucursales: [],
            clientes: [],
            colocadores: [],
        });
    }
}
