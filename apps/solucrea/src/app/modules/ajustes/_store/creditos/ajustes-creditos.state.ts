import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';
import { AjustesCreditosService } from 'app/modules/ajustes/_services';

import { AjustesModeCredito, ClearCreditos, ClearCreditoState, GetAllCreditos } from './ajustes-creditos.actions';
import { AjustesCreditosStateModel } from './ajustes-creditos.model';
import { Producto } from '.prisma/client';
import { tap } from 'rxjs';

@State<AjustesCreditosStateModel>({
    name: 'ajustesCreditos',
    defaults: {
        creditos: [],
        editMode: 'edit',
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
    static selectedCredito({ selectedCredito }: AjustesCreditosStateModel): Producto | undefined {
        return selectedCredito;
    }

    @Selector()
    static loading({ loading }: AjustesCreditosStateModel): boolean {
        return loading;
    }

    @Selector()
    static creditos({ creditos }: AjustesCreditosStateModel): Producto[] {
        return creditos;
    }

    @Action(GetAllCreditos)
    getAllSucursales(ctx: StateContext<AjustesCreditosStateModel>) {
        ctx.patchState({ loading: true });
        return this._ajustesCreditosService.getProductos().pipe(
            tap((creditos: Producto[]) => {
                ctx.patchState({
                    creditos,
                    loading: false,
                });
            })
        );
    }

    @Action(AjustesModeCredito)
    toggleEditModeCredito(ctx: StateContext<AjustesCreditosStateModel>, action: AjustesModeCredito) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(ClearCreditoState)
    clearCreditosState(ctx: StateContext<AjustesCreditosStateModel>) {
        ctx.patchState({
            editMode: 'edit',
            selectedCredito: undefined,
            loading: false,
        });
    }

    @Action(ClearCreditos)
    clearCreditos(ctx: StateContext<AjustesCreditosStateModel>) {
        ctx.patchState({
            creditos: [],
        });
    }
}
