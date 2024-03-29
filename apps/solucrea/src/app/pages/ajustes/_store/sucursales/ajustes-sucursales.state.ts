import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IColoniaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { AjustesSucursalService } from 'app/pages/ajustes/_services';
import { ClientesService } from 'app/pages/clientes';
import { sortBy } from 'lodash';
import { tap } from 'rxjs';

import { ChangeSearchFilter } from '.';
import {
  AddSucursal,
  AjustesModeSucursal,
  ClearSucursales,
  ClearSucursalState,
  DeleteSucursal,
  EditSucursal,
  GetAllSucursales,
  GetColonias,
  SelectSucursal,
} from './ajustes-sucursales.actions';
import { AjustesSucursalesStateModel } from './ajustes-sucursales.model';

@State<AjustesSucursalesStateModel>({
  name: 'ajustesSucursales',
  defaults: {
    sucursales: [],
    sucursalesFiltered: [],
    editMode: 'new',
    selectedSucursal: undefined,
    loading: false,
    colonias: undefined,
  },
})
@Injectable()
export class AjustesSucursalesState {
  private _ajustesSucursalesService = inject(AjustesSucursalService);
  private _clientesService = inject(ClientesService);

  @Action(AjustesModeSucursal)
  toggleEditModeSucursal(ctx: StateContext<AjustesSucursalesStateModel>, action: AjustesModeSucursal) {
    const { payload } = action;
    ctx.patchState({ editMode: payload });
  }

  @Action(GetAllSucursales)
  getAllSucursales(ctx: StateContext<AjustesSucursalesStateModel>) {
    ctx.patchState({ loading: true });
    return this._ajustesSucursalesService.getSucursales().pipe(
      tap((sucursales: ISucursalReturnDto[]) => {
        const sucursalesFiltered = sucursales.filter((sucursal: ISucursalReturnDto) => sucursal.activa === true);
        ctx.patchState({
          sucursales,
          sucursalesFiltered,
          loading: false,
        });
      })
    );
  }

  @Action(AddSucursal)
  addSucursal(ctx: StateContext<AjustesSucursalesStateModel>, action: AddSucursal) {
    const { payload } = action;
    return this._ajustesSucursalesService.addSucursal(payload).pipe(
      tap((sucursal: ISucursalReturnDto) => {
        const state = ctx.getState();
        const sucursales = [...state.sucursales];
        sucursales.push(sucursal);

        ctx.patchState({ sucursales });
      })
    );
  }

  @Action(EditSucursal)
  editSucursal(ctx: StateContext<AjustesSucursalesStateModel>, action: EditSucursal) {
    const { id, payload } = action;
    return this._ajustesSucursalesService.editSucursal(id, payload).pipe(
      tap((sucursal: ISucursalReturnDto) => {
        const state = ctx.getState();
        if (state.sucursales) {
          const sucursales = [...state.sucursales];
          const idx = sucursales.findIndex(suc => suc.id === id);
          sucursales[idx] = sucursal;

          ctx.patchState({
            sucursales,
          });
        }
      })
    );
  }

  @Action(SelectSucursal)
  selectSucursal(ctx: StateContext<AjustesSucursalesStateModel>, { id }: SelectSucursal) {
    return this._ajustesSucursalesService.getSucursal(id).pipe(
      tap(selectedSucursal => {
        ctx.patchState({ selectedSucursal });
      })
    );
  }

  @Action(DeleteSucursal)
  deleteSucursal(ctx: StateContext<AjustesSucursalesStateModel>, action: DeleteSucursal) {
    const { id } = action;
    return this._ajustesSucursalesService.deleteSucursal(id).pipe(
      tap((sucursal: ISucursalReturnDto) => {
        const state = ctx.getState();
        if (sucursal) {
          const sucursales = [...state.sucursales];
          const idx = sucursales.findIndex(suc => suc.id === id);
          sucursales[idx] = sucursal;
          ctx.patchState({
            sucursales,
          });
        }
      })
    );
  }

  @Action(GetColonias)
  getColonias(ctx: StateContext<AjustesSucursalesStateModel>, { cp }: GetColonias) {
    return this._clientesService.getColoniasByCp(cp).pipe(
      tap((colonias: IColoniaReturnDto) => {
        const state = ctx.getState();
        if (colonias) {
          colonias = {
            ...colonias,
            colonias: sortBy(colonias.colonias, 'descripcion'),
          };
          ctx.patchState({
            colonias,
          });
        }
      })
    );
  }

  @Action(ChangeSearchFilter)
  changeSearchFilter(ctx: StateContext<AjustesSucursalesStateModel>, { payload }: ChangeSearchFilter) {
    ctx.patchState({ loading: true });
    const { sucursales } = ctx.getState();
    const sucursalesFiltered = sucursales.filter((sucursal: ISucursalReturnDto) => sucursal.activa === payload);
    ctx.patchState({
      sucursalesFiltered,
      loading: false,
    });
  }

  @Action(ClearSucursalState)
  clearSucursalState(ctx: StateContext<AjustesSucursalesStateModel>) {
    ctx.patchState({
      editMode: 'new',
      selectedSucursal: undefined,
      loading: false,
      colonias: undefined,
    });
  }

  @Action(ClearSucursales)
  clearSucursales(ctx: StateContext<AjustesSucursalesStateModel>) {
    ctx.patchState({
      sucursales: [],
      sucursalesFiltered: [],
    });
  }
}
