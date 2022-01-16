import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    IClienteReturnDto,
    ICreditoReturnDto,
    IModalidadSeguroReturnDto,
    IParentescoReturnDto,
    ISeguroReturnDto,
    ISucursalReturnDto,
    IUsuarioReturnDto,
} from 'api/dtos';
import { EditMode } from 'app/core/models';
import { AjustesCreditosService, AjustesUsuarioService } from 'app/modules/ajustes/_services';
import { GetAllCreditos } from 'app/modules/ajustes/_store';
import { CajaService } from 'app/modules/caja/_services/caja.service';
import { ClientesService } from 'app/modules/clientes';
import { ParentescosService } from 'app/shared';
import { sortBy } from 'lodash';
import { forkJoin, tap } from 'rxjs';

import { ISegurosData } from '../_models';
import { CreditosService } from '../_services/creditos.service';
import {
    ClearCreditosDetails,
    ClearCreditosState,
    GetAllCreditosCliente,
    GetClienteData,
    GetClientesCount,
    GetClienteWhere,
    GetCreditosConfiguration,
    GetSucursalesWhereCaja,
    GetTurnosCount,
    ModeCredito,
    SelectCliente,
    SelectClienteReferral,
    SelectModalidadSeguro,
    SelectParentesco,
    SelectProducto,
    SelectSeguro,
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
        selectedProducto: undefined,
        productos: [],
        sucursales: [],
        clientes: [],
        selectedCliente: undefined,
        selectedModalidadDeSeguro: undefined,
        selectedSeguro: undefined,
        colocadores: [],
        parentescos: [],
        selectedOtro: false,
        segurosData: undefined,
        loading: false,
        clientesCount: 0,
        turnosCount: 0,
        selectedClienteReferral: undefined,
    },
})
@Injectable()
export class CreditosState {
    constructor(
        private _creditosService: CreditosService,
        private _ajustesCreditosService: AjustesCreditosService,
        private _ajustesUsuarios: AjustesUsuarioService,
        private _clientesService: ClientesService,
        private _parentescosService: ParentescosService,
        private _cajaService: CajaService
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
    static selectedClienteReferral({ selectedClienteReferral }: CreditosStateModel): IClienteReturnDto {
        return selectedClienteReferral;
    }

    @Selector()
    static sucursales({ sucursales }: CreditosStateModel): ISucursalReturnDto[] {
        return sucursales;
    }

    @Selector()
    static parentescos({ parentescos }: CreditosStateModel): IParentescoReturnDto[] {
        return parentescos;
    }

    @Selector()
    static selectedProducto({ selectedProducto }: CreditosStateModel): Producto {
        return selectedProducto;
    }

    @Selector()
    static selectedOtro({ selectedOtro }: CreditosStateModel): boolean {
        return selectedOtro;
    }

    @Selector()
    static selectedModalidadDeSeguro({ selectedModalidadDeSeguro }: CreditosStateModel): IModalidadSeguroReturnDto {
        return selectedModalidadDeSeguro;
    }

    @Selector()
    static selectedSeguro({ selectedSeguro }: CreditosStateModel): ISeguroReturnDto {
        return selectedSeguro;
    }

    @Selector()
    static segurosData({ segurosData }: CreditosStateModel): ISegurosData {
        return segurosData;
    }

    @Selector()
    static colocadores({ colocadores }: CreditosStateModel): IUsuarioReturnDto[] {
        return colocadores;
    }

    @Selector()
    static clientesCount({ clientesCount }: CreditosStateModel): number {
        return clientesCount;
    }

    @Selector()
    static turnosCount({ turnosCount }: CreditosStateModel): number {
        return turnosCount;
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
            this._creditosService.getSegurosData(),
            this._ajustesUsuarios.getUsuariosWhere({ role: Role.COLOCADOR }),
            this._parentescosService.getParentescos(),
        ]).pipe(
            tap(([productos, segurosData, colocadores, parentescos]) => {
                if (segurosData) {
                    segurosData.modalidadesDeSeguro = sortBy(segurosData.modalidadesDeSeguro, 'titulo');
                }
                ctx.patchState({
                    productos: sortBy(productos, 'descripcion'),
                    segurosData,
                    colocadores: sortBy(colocadores, 'apellido'),
                    parentescos: sortBy(parentescos, 'descripcion'),
                });
            })
        );
    }

    @Action(GetSucursalesWhereCaja)
    getSucursalesWhereCaja(ctx: StateContext<CreditosStateModel>, { minAmount, maxAmount }: GetSucursalesWhereCaja) {
        return this._creditosService.getSucursalesWithCaja(minAmount, maxAmount).pipe(
            tap((sucursales) => {
                if (sucursales) {
                    ctx.patchState({ sucursales: sortBy(sucursales, 'descripcion') });
                }
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

    @Action(SelectCliente)
    selectClienteForCredito(ctx: StateContext<CreditosStateModel>, { cliente }: SelectCliente) {
        ctx.patchState({ selectedCliente: cliente, clientes: undefined });
    }

    @Action(SelectClienteReferral)
    selectClienteReferralForCredito(ctx: StateContext<CreditosStateModel>, { cliente }: SelectClienteReferral) {
        ctx.patchState({ selectedClienteReferral: cliente, clientes: undefined });
    }

    @Action(SelectProducto)
    selectProductoForCredito(ctx: StateContext<CreditosStateModel>, { id }: SelectProducto) {
        let selectedProducto;
        if (id === null) {
            selectedProducto = undefined;
        } else {
            selectedProducto = ctx.getState().productos.filter((producto: Producto) => producto.id === id)[0];
        }
        ctx.patchState({ selectedProducto });
    }

    @Action(GetClienteWhere)
    getClientesWhere(ctx: StateContext<CreditosStateModel>, { data }: GetClienteWhere) {
        const search = { data };
        const { selectedCliente } = ctx.getState();
        return this._clientesService.getClientesWhere(search).pipe(
            tap((clientesReturn: IClienteReturnDto[]) => {
                if (clientesReturn.length > 0) {
                    const clientes = clientesReturn.filter((cliente) => {
                        if ((selectedCliente && selectedCliente.id !== cliente.id) || !selectedCliente) {
                            return cliente;
                        }
                    });

                    ctx.patchState({
                        clientes,
                    });
                } else {
                    ctx.patchState({
                        clientes: [],
                    });
                }
            })
        );
    }

    @Action(GetClientesCount)
    getClientesCount(ctx: StateContext<CreditosStateModel>) {
        return this._clientesService.getClientesCount().pipe(
            tap((clientesCount: number) => {
                ctx.patchState({
                    clientesCount,
                });
            })
        );
    }

    @Action(GetTurnosCount)
    getTurnosCount(ctx: StateContext<CreditosStateModel>) {
        return this._cajaService.getTurnosCount().pipe(
            tap((turnosCount: number) => {
                ctx.patchState({
                    turnosCount,
                });
            })
        );
    }

    @Action(ModeCredito)
    toggleEditModeCredito(ctx: StateContext<CreditosStateModel>, action: ModeCredito) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(SelectParentesco)
    selectParentesco(ctx: StateContext<CreditosStateModel>, { id }: SelectParentesco) {
        const parentesco = ctx.getState().parentescos.filter((par: IParentescoReturnDto) => par.id === id)[0];
        if (parentesco.descripcion.includes('Otro')) {
            ctx.patchState({ selectedOtro: true });
        } else {
            ctx.patchState({ selectedOtro: false });
        }
    }

    @Action(SelectModalidadSeguro)
    selectModalidadSeguro(ctx: StateContext<CreditosStateModel>, { id }: SelectModalidadSeguro) {
        const selectedModalidadDeSeguro = ctx
            .getState()
            .segurosData.modalidadesDeSeguro.filter((modalidad) => modalidad.id === id)[0];
        if (selectedModalidadDeSeguro.titulo.includes('Sin Seguro')) {
            ctx.patchState({ selectedModalidadDeSeguro: undefined });
        } else {
            ctx.patchState({ selectedModalidadDeSeguro });
        }
    }

    @Action(SelectSeguro)
    selectSeguro(ctx: StateContext<CreditosStateModel>, { id }: SelectSeguro) {
        let selectedSeguro;
        if (id === null) {
            selectedSeguro = undefined;
        } else {
            selectedSeguro = ctx
                .getState()
                .segurosData.seguros.filter((seguro: ISeguroReturnDto) => seguro.id === id)[0];
        }
        ctx.patchState({ selectedSeguro });
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
            selectedProducto: undefined,
            selectedSeguro: undefined,
            productos: [],
            sucursales: [],
            clientes: [],
            selectedCliente: undefined,
            selectedClienteReferral: undefined,
            selectedModalidadDeSeguro: undefined,
            colocadores: [],
            parentescos: [],
            loading: false,
            segurosData: undefined,
            clientesCount: 0,
        });
    }

    @Action(ClearCreditosDetails)
    clearDetailState(ctx: StateContext<CreditosStateModel>) {
        ctx.patchState({
            productos: [],
            sucursales: [],
            clientes: [],
            colocadores: [],
            parentescos: [],
            selectedCliente: undefined,
            selectedCredito: undefined,
            selectedProducto: undefined,
            selectedOtro: false,
            segurosData: undefined,
            clientesCount: 0,
        });
    }
}
