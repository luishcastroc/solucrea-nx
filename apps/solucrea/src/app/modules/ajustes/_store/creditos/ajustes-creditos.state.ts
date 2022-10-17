import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';
import { AjustesCreditosService } from 'app/modules/ajustes/_services';
import { tap } from 'rxjs';

import {
  AddCredito,
  AjustesModeCredito,
  ClearCreditos,
  ClearCreditoState,
  EditCredito,
  GetAllCreditos,
  SelectCredito,
} from './ajustes-creditos.actions';
import { AjustesCreditosStateModel } from './ajustes-creditos.model';
import { ChangeSearchFilterCreditos } from '.';
import { Producto } from '@prisma/client';

@State<AjustesCreditosStateModel>({
  name: 'ajustesCreditos',
  defaults: {
    creditos: [],
    creditosFiltered: [],
    editMode: 'new',
    selectedCredito: undefined,
    loading: false,
  },
})
@Injectable()
export class AjustesCreditosState {
  constructor(private _ajustesCreditosService: AjustesCreditosService) {}

  @Selector()
  static editMode({ editMode }: AjustesCreditosStateModel): EditMode {
    return editMode;
  }

  @Selector()
  static selectedCredito({
    selectedCredito,
  }: AjustesCreditosStateModel): Producto | undefined {
    return selectedCredito;
  }

  @Selector()
  static loading({ loading }: AjustesCreditosStateModel): boolean {
    return loading;
  }

  @Selector()
  static creditos({ creditosFiltered }: AjustesCreditosStateModel): Producto[] {
    return creditosFiltered;
  }

  @Action(GetAllCreditos)
  getAllCreditos(ctx: StateContext<AjustesCreditosStateModel>) {
    ctx.patchState({ loading: true });
    return this._ajustesCreditosService.getProductos().pipe(
      tap((creditos: Producto[]) => {
        const creditosFiltered = creditos.filter(
          (credito: Producto) => credito.activo === true
        );
        ctx.patchState({
          creditos,
          creditosFiltered,
          loading: false,
        });
      })
    );
  }

  @Action(AddCredito)
  addNewCredito(
    ctx: StateContext<AjustesCreditosStateModel>,
    action: AddCredito
  ) {
    const { payload } = action;
    return this._ajustesCreditosService.addProducto(payload).pipe(
      tap((credito: Producto) => {
        const state = ctx.getState();
        const creditos = [...state.creditos];
        creditos.push(credito);

        ctx.patchState({ creditos });
      })
    );
  }

  @Action(EditCredito)
  editCredito(
    ctx: StateContext<AjustesCreditosStateModel>,
    action: EditCredito
  ) {
    const { id, payload } = action;
    return this._ajustesCreditosService.editProducto(id, payload).pipe(
      tap((credito: Producto) => {
        const state = ctx.getState();
        if (state.creditos) {
          const creditos = [...state.creditos];
          const idx = creditos.findIndex(suc => suc.id === id);
          creditos[idx] = credito;

          ctx.patchState({
            creditos,
          });
        }
      })
    );
  }

  @Action(SelectCredito)
  selectSucursal(
    ctx: StateContext<AjustesCreditosStateModel>,
    { id }: SelectCredito
  ) {
    return this._ajustesCreditosService.getProducto(id).pipe(
      tap(selectedCredito => {
        ctx.patchState({ selectedCredito });
      })
    );
  }

  @Action(ChangeSearchFilterCreditos)
  changeSearchFilter(
    ctx: StateContext<AjustesCreditosStateModel>,
    { payload }: ChangeSearchFilterCreditos
  ) {
    ctx.patchState({ loading: true });
    const { creditos } = ctx.getState();
    const creditosFiltered = creditos.filter(
      (credito: Producto) => credito.activo === payload
    );
    ctx.patchState({
      creditosFiltered,
      loading: false,
    });
  }

  @Action(AjustesModeCredito)
  toggleEditModeCredito(
    ctx: StateContext<AjustesCreditosStateModel>,
    action: AjustesModeCredito
  ) {
    const { payload } = action;
    ctx.patchState({ editMode: payload });
  }

  @Action(ClearCreditoState)
  clearCreditosState(ctx: StateContext<AjustesCreditosStateModel>) {
    ctx.patchState({
      editMode: 'new',
      selectedCredito: undefined,
      loading: false,
    });
  }

  @Action(ClearCreditos)
  clearCreditos(ctx: StateContext<AjustesCreditosStateModel>) {
    ctx.patchState({
      creditos: [],
      creditosFiltered: [],
    });
  }
}
