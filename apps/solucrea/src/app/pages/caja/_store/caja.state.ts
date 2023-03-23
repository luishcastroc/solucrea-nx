import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MovimientoDeCaja } from '@prisma/client';
import { ICajaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { AjustesSucursalService } from 'app/pages/ajustes/_services';
import { sortBy } from 'lodash';
import { tap } from 'rxjs';

import { CajaService } from '../_services/caja.service';
import {
  AddCaja,
  GetAll,
  GetAllSucursales,
  SelectCaja,
  CajasMode,
  EditCaja,
  ClearCajasState,
  GetAllMovimientos,
  CreateMovimiento,
  ClearMovimientos,
} from './caja.actions';
import { CajaStateModel } from './caja.model';

@State<CajaStateModel>({
  name: 'caja',
  defaults: {
    cajas: [],
    sucursales: [],
    movimientos: [],
    editMode: 'new',
    selectedCaja: undefined,
    loading: false,
  },
})
@Injectable()
export class CajasState {
  constructor(
    private _cajasService: CajaService,
    private _store: Store,
    private _sucursalesService: AjustesSucursalService
  ) {}

  @Selector()
  static editMode({ editMode }: CajaStateModel): EditMode {
    return editMode;
  }

  @Selector()
  static cajas({ cajas }: CajaStateModel): ICajaReturnDto[] {
    return cajas;
  }

  @Selector()
  static sucursales({ sucursales }: CajaStateModel): ISucursalReturnDto[] {
    return sucursales;
  }

  @Selector()
  static selectedCaja({ selectedCaja }: CajaStateModel): ICajaReturnDto | undefined {
    return selectedCaja;
  }

  @Selector()
  static movimientos({ movimientos }: CajaStateModel): MovimientoDeCaja[] | [] {
    return movimientos;
  }

  @Action(GetAll)
  getAllCajas(ctx: StateContext<CajaStateModel>) {
    return this._cajasService.getCajas().pipe(
      tap((cajas: ICajaReturnDto[]) => {
        if (cajas) {
          ctx.patchState({
            cajas,
          });
        }
      })
    );
  }

  @Action(GetAllSucursales)
  getAllSucursales(ctx: StateContext<CajaStateModel>) {
    return this._sucursalesService.getSucursales().pipe(
      tap((sucursales: ISucursalReturnDto[]) => {
        if (sucursales) {
          const sucursalesActivas = sucursales.filter((sucursal: ISucursalReturnDto) => sucursal.activa === true);
          ctx.patchState({ sucursales: sucursalesActivas });
        }
      })
    );
  }

  @Action(GetAllMovimientos)
  getAllMovimientos(ctx: StateContext<CajaStateModel>, { id }: GetAllMovimientos) {
    return this._cajasService.getMovimientos(id).pipe(
      tap(movimientos => {
        const movimientosSorted = sortBy(movimientos, 'fechaCreacion');
        ctx.patchState({ movimientos: movimientosSorted });
      })
    );
  }

  @Action(CreateMovimiento)
  createMovimiento(ctx: StateContext<CajaStateModel>, { payload }: CreateMovimiento) {
    return this._cajasService.addMovimiento(payload).pipe(
      tap((movimiento: MovimientoDeCaja) => {
        const movimientos = [...ctx.getState().movimientos];
        movimientos.push(movimiento);
        ctx.patchState({ movimientos });
      })
    );
  }

  @Action(AddCaja)
  addCaja(ctx: StateContext<CajaStateModel>, action: AddCaja) {
    const { payload } = action;
    return this._cajasService.addCaja(payload).pipe(
      tap((caja: ICajaReturnDto) => {
        const state = ctx.getState();
        const cajas = [...state.cajas];
        cajas.push(caja);

        ctx.patchState({ cajas });
      })
    );
  }

  @Action(EditCaja)
  editSucursal(ctx: StateContext<CajaStateModel>, action: EditCaja) {
    const { id, payload } = action;
    return this._cajasService.editCaja(id, payload).pipe(
      tap((caja: ICajaReturnDto) => {
        const state = ctx.getState();
        if (state.cajas) {
          const cajas = [...state.cajas];
          const idx = cajas.findIndex(caj => caj.id === id);
          cajas[idx] = caja;

          ctx.patchState({
            cajas,
          });
        }
      })
    );
  }

  @Action(SelectCaja)
  selectCaja(ctx: StateContext<CajaStateModel>, { id }: SelectCaja) {
    return this._cajasService.getCaja(id).pipe(
      tap((selectedCaja: ICajaReturnDto) => {
        if (selectedCaja) {
          ctx.patchState({
            selectedCaja,
          });
        }
      })
    );
  }

  @Action(CajasMode)
  toggleEditModeSucursal(ctx: StateContext<CajaStateModel>, action: CajasMode) {
    const { payload } = action;
    ctx.patchState({ editMode: payload });
  }

  @Action(ClearCajasState)
  clearCajaState(ctx: StateContext<CajaStateModel>) {
    ctx.patchState({
      cajas: [],
      sucursales: [],
      editMode: 'new',
      selectedCaja: undefined,
      loading: false,
      movimientos: [],
    });
  }

  @Action(ClearMovimientos)
  clearMovimientos(ctx: StateContext<CajaStateModel>) {
    ctx.patchState({
      movimientos: [],
    });
  }
}
