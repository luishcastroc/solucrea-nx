import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';

import { AjustesCreditosService } from '../../_services/ajustes-creditos.service';
import { AjustesModeCredito, GetAllCreditos, ClearCreditoState, ClearCreditos } from './ajustes-creditos.actions';
import { AjustesCreditosStateModel } from './ajustes-creditos.model';
import { Producto } from '.prisma/client';

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
    static selectedSucursal({ selectedCredito }: AjustesCreditosStateModel): Producto | undefined {
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

    @Action(AjustesModeCredito)
    toggleEditModeCredito(ctx: StateContext<AjustesCreditosStateModel>, action: AjustesModeCredito) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(ClearCreditoState)
    clearSucursalState(ctx: StateContext<AjustesCreditosStateModel>) {
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
