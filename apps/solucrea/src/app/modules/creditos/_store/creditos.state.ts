import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Producto, Role } from '@prisma/client';
import { ISegurosData } from '@solucrea-utils';
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
import {
  AjustesCreditosService,
  AjustesUsuarioService,
} from 'app/modules/ajustes/_services';
import { CajaService } from 'app/modules/caja/_services/caja.service';
import { ClientesService } from 'app/modules/clientes';
import { ParentescosService } from 'app/shared';
import { cloneDeep, sortBy } from 'lodash';
import { forkJoin, mergeMap, tap } from 'rxjs';

import { CreditosService } from '../_services/creditos.service';
import {
  ClearCreditosDetails,
  ClearCreditosState,
  CreateCredito,
  GetAllCreditos,
  GetAllCreditosCliente,
  GetClienteData,
  GetClientesCount,
  GetClienteWhere,
  GetCobratarios,
  GetCreditosConfiguration,
  GetCreditosCount,
  GetSucursalesWhereCaja,
  GetTurnosCount,
  ModeCredito,
  SavePago,
  SelectCliente,
  SelectClienteReferral,
  SelectCredito,
  SelectModalidadSeguro,
  SelectParentesco,
  SelectProducto,
  SelectSeguro,
} from './creditos.actions';
import { CreditosStateModel } from './creditos.model';

@State<CreditosStateModel>({
  name: 'creditos',
  defaults: {
    creditos: [],
    editMode: 'new',
    selectedCredito: undefined,
    selectedProducto: undefined,
    productos: [],
    sucursales: [],
    clientes: [],
    selectedCliente: undefined,
    selectedModalidadDeSeguro: undefined,
    selectedSeguro: undefined,
    colocadores: [],
    cobratarios: [],
    parentescos: [],
    selectedOtro: false,
    segurosData: undefined,
    loading: false,
    creditosCount: 0,
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
  static selectedCredito({
    selectedCredito,
  }: CreditosStateModel): ICreditoReturnDto | undefined {
    return selectedCredito;
  }

  @Selector()
  static loading({ loading }: CreditosStateModel): boolean {
    return loading;
  }

  @Selector()
  static creditos({ creditos }: CreditosStateModel): ICreditoReturnDto[] {
    return creditos;
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
  static selectedCliente({
    selectedCliente,
  }: CreditosStateModel): IClienteReturnDto | undefined {
    return selectedCliente;
  }

  @Selector()
  static selectedClienteReferral({
    selectedClienteReferral,
  }: CreditosStateModel): IClienteReturnDto | undefined {
    return selectedClienteReferral;
  }

  @Selector()
  static sucursales({ sucursales }: CreditosStateModel): ISucursalReturnDto[] {
    return sucursales;
  }

  @Selector()
  static parentescos({
    parentescos,
  }: CreditosStateModel): IParentescoReturnDto[] {
    return parentescos;
  }

  @Selector()
  static selectedProducto({
    selectedProducto,
  }: CreditosStateModel): Producto | undefined {
    return selectedProducto;
  }

  @Selector()
  static selectedOtro({ selectedOtro }: CreditosStateModel): boolean {
    return selectedOtro;
  }

  @Selector()
  static selectedModalidadDeSeguro({
    selectedModalidadDeSeguro,
  }: CreditosStateModel): IModalidadSeguroReturnDto | undefined {
    return selectedModalidadDeSeguro;
  }

  @Selector()
  static selectedSeguro({
    selectedSeguro,
  }: CreditosStateModel): ISeguroReturnDto | undefined {
    return selectedSeguro;
  }

  @Selector()
  static segurosData({
    segurosData,
  }: CreditosStateModel): ISegurosData | undefined {
    return segurosData;
  }

  @Selector()
  static colocadores({ colocadores }: CreditosStateModel): IUsuarioReturnDto[] {
    return colocadores;
  }

  @Selector()
  static creditosCount({ creditosCount }: CreditosStateModel): number {
    return creditosCount;
  }

  @Selector()
  static clientesCount({ clientesCount }: CreditosStateModel): number {
    return clientesCount;
  }

  @Selector()
  static turnosCount({ turnosCount }: CreditosStateModel): number {
    return turnosCount;
  }

  @Selector()
  static cobratarios({
    cobratarios,
  }: CreditosStateModel): IUsuarioReturnDto[] | [] {
    return cobratarios;
  }

  @Action(GetAllCreditosCliente)
  getAllCreditosCliente(
    { patchState }: StateContext<CreditosStateModel>,
    { id, status }: GetAllCreditosCliente
  ) {
    patchState({ loading: true });
    return this._creditosService.getCreditosCliente(id, status).pipe(
      tap((creditos: ICreditoReturnDto[]) => {
        patchState({
          creditos,
          loading: false,
        });
      })
    );
  }

  @Action(GetAllCreditos)
  getAllCreditos(
    { patchState }: StateContext<CreditosStateModel>,
    { status }: GetAllCreditos
  ) {
    patchState({ loading: true });
    return this._creditosService.getCreditos(status).pipe(
      tap((creditos: ICreditoReturnDto[]) => {
        patchState({
          creditos,
          loading: false,
        });
      })
    );
  }

  @Action(GetCreditosConfiguration)
  getCreditosConfiguration({ patchState }: StateContext<CreditosStateModel>) {
    return forkJoin([
      this._ajustesCreditosService.getProductos(),
      this._creditosService.getSegurosData(),
      this._ajustesUsuarios.getUsuariosWhere({ role: Role.COLOCADOR }),
      this._parentescosService.getParentescos(),
    ]).pipe(
      tap(([productos, segurosData, colocadores, parentescos]) => {
        if (segurosData) {
          segurosData.modalidadesDeSeguro = sortBy(
            segurosData.modalidadesDeSeguro,
            'titulo'
          );
        }
        patchState({
          productos: sortBy(productos, 'descripcion'),
          segurosData,
          colocadores: sortBy(colocadores, 'apellido'),
          parentescos: sortBy(parentescos, 'descripcion'),
        });
      })
    );
  }

  @Action(GetCobratarios)
  getCobratarios({ patchState }: StateContext<CreditosStateModel>) {
    return this._ajustesUsuarios.getUsuariosWhere({ role: Role.COBRADOR }).pipe(
      tap(cobratarios => {
        if (cobratarios) {
          patchState({
            cobratarios: sortBy(cobratarios, 'apellido'),
          });
        }
      })
    );
  }

  @Action(GetSucursalesWhereCaja)
  getSucursalesWhereCaja(
    { patchState }: StateContext<CreditosStateModel>,
    { minAmount, maxAmount }: GetSucursalesWhereCaja
  ) {
    return this._creditosService
      .getSucursalesWithCaja(minAmount, maxAmount)
      .pipe(
        tap(sucursales => {
          if (sucursales) {
            patchState({ sucursales: sortBy(sucursales, 'descripcion') });
          }
        })
      );
  }

  @Action(GetClienteData)
  getClienteData(
    { patchState }: StateContext<CreditosStateModel>,
    { id }: GetClienteData
  ) {
    return this._clientesService.getCliente(id).pipe(
      tap((selectedCliente: IClienteReturnDto) => {
        patchState({
          selectedCliente,
        });
      })
    );
  }

  @Action(SelectCliente)
  selectClienteForCredito(
    { patchState }: StateContext<CreditosStateModel>,
    { cliente }: SelectCliente
  ) {
    patchState({ selectedCliente: cliente, clientes: undefined });
  }

  @Action(SelectClienteReferral)
  selectClienteReferralForCredito(
    { patchState }: StateContext<CreditosStateModel>,
    { cliente }: SelectClienteReferral
  ) {
    patchState({ selectedClienteReferral: cliente, clientes: undefined });
  }

  @Action(SelectProducto)
  selectProductoForCredito(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { clienteId, productId }: SelectProducto
  ) {
    let selectedProducto;
    if (clienteId === null || productId === null) {
      selectedProducto = undefined;
    } else {
      return this._creditosService
        .getOpenCreditosCount(clienteId, productId)
        .pipe(
          tap(count => {
            if (count > 0) {
              selectedProducto = undefined;
            } else {
              selectedProducto = getState().productos.filter(
                (producto: Producto) => producto.id === productId
              )[0];
              patchState({ selectedProducto });
            }
          })
        );
    }
    patchState({ selectedProducto });
    return;
  }

  @Action(GetClienteWhere)
  getClientesWhere(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { data }: GetClienteWhere
  ) {
    const search = { data };
    const { selectedCliente } = getState();
    return this._clientesService.getClientesWhere(search).pipe(
      tap((clientesReturn: IClienteReturnDto[]) => {
        if (clientesReturn.length > 0) {
          const clientes = clientesReturn.filter(cliente => {
            if (
              (selectedCliente && selectedCliente.id !== cliente.id) ||
              !selectedCliente
            ) {
              return cliente;
            } else {
              return {};
            }
          });

          patchState({
            clientes,
          });
        } else {
          patchState({
            clientes: [],
          });
        }
      })
    );
  }

  @Action(GetCreditosCount)
  getCreditosCount(
    { patchState }: StateContext<CreditosStateModel>,
    { id }: GetCreditosCount
  ) {
    return this._creditosService.getCreditosCount(id).pipe(
      tap((creditosCount: number) => {
        patchState({
          creditosCount,
        });
      })
    );
  }

  @Action(GetClientesCount)
  getClientesCount({ patchState }: StateContext<CreditosStateModel>) {
    return this._clientesService.getClientesCount().pipe(
      tap((clientesCount: number) => {
        patchState({
          clientesCount,
        });
      })
    );
  }

  @Action(GetTurnosCount)
  getTurnosCount({ patchState }: StateContext<CreditosStateModel>) {
    return this._cajaService.getTurnosCount().pipe(
      tap((turnosCount: number) => {
        patchState({
          turnosCount,
        });
      })
    );
  }

  @Action(ModeCredito)
  toggleEditModeCredito(
    { patchState }: StateContext<CreditosStateModel>,
    action: ModeCredito
  ) {
    const { payload } = action;
    patchState({ editMode: payload });
  }

  @Action(SelectCredito)
  selectCredito(
    { patchState }: StateContext<CreditosStateModel>,
    { id }: SelectCredito
  ) {
    return this._creditosService.getCredito(id).pipe(
      tap(selectedCredito => {
        if (selectedCredito) {
          patchState({ selectedCredito });
        }
      })
    );
  }

  @Action(SelectParentesco)
  selectParentesco(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { id }: SelectParentesco
  ) {
    const parentesco = getState().parentescos.filter(
      (par: IParentescoReturnDto) => par.id === id
    )[0];
    if (parentesco.descripcion.includes('Otro')) {
      patchState({ selectedOtro: true });
    } else {
      patchState({ selectedOtro: false });
    }
  }

  @Action(SelectModalidadSeguro)
  selectModalidadSeguro(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { id }: SelectModalidadSeguro
  ) {
    const selectedModalidadDeSeguro =
      getState().segurosData?.modalidadesDeSeguro.filter(
        modalidad => modalidad.id === id
      )[0];

    patchState({ selectedModalidadDeSeguro });
  }

  @Action(SelectSeguro)
  selectSeguro(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { id }: SelectSeguro
  ) {
    let selectedSeguro;
    if (id === null) {
      selectedSeguro = undefined;
    } else {
      selectedSeguro = getState().segurosData?.seguros.filter(
        (seguro: ISeguroReturnDto) => seguro.id === id
      )[0];
    }
    patchState({ selectedSeguro });
  }

  @Action(CreateCredito)
  createCredito(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { data }: CreateCredito
  ) {
    return this._creditosService.createCredito(data).pipe(
      tap((credito: ICreditoReturnDto) => {
        const state = getState();
        const creditos = [...state.creditos, credito];
        patchState({ creditos });
      })
    );
  }

  @Action(SavePago)
  savePago(
    { getState, patchState }: StateContext<CreditosStateModel>,
    { data }: SavePago
  ) {
    const creditoId = data.credito?.connect?.id;
    return this._creditosService.savePago(data).pipe(
      mergeMap(() => this._creditosService.getCredito(creditoId as string)),
      tap((credito: ICreditoReturnDto) => {
        const state = getState();
        const creditos = cloneDeep(state.creditos);
        const idx = creditos.findIndex(creditoSt => creditoSt.id === creditoId);
        creditos[idx] = credito;
        patchState({ creditos, selectedCredito: creditos[idx] });
      })
    );
  }

  @Action(ClearCreditosState)
  clearState({ patchState }: StateContext<CreditosStateModel>) {
    patchState({
      creditos: [],
      editMode: 'new',
      selectedCredito: undefined,
      selectedProducto: undefined,
      selectedSeguro: undefined,
      productos: [],
      sucursales: [],
      clientes: [],
      selectedCliente: undefined,
      selectedClienteReferral: undefined,
      selectedModalidadDeSeguro: undefined,
      colocadores: [],
      cobratarios: [],
      parentescos: [],
      loading: false,
      segurosData: undefined,
      clientesCount: 0,
      creditosCount: 0,
      turnosCount: 0,
    });
  }

  @Action(ClearCreditosDetails)
  clearDetailState({ patchState }: StateContext<CreditosStateModel>) {
    patchState({
      productos: [],
      sucursales: [],
      clientes: [],
      colocadores: [],
      cobratarios: [],
      parentescos: [],
      selectedCliente: undefined,
      selectedCredito: undefined,
      selectedProducto: undefined,
      selectedOtro: false,
      segurosData: undefined,
      clientesCount: 0,
      creditosCount: 0,
    });
  }
}
