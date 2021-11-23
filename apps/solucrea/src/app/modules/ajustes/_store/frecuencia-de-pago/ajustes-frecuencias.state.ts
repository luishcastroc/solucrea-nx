import { AjustesFrecuenciasDePagoService } from 'app/modules/ajustes/_services';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';

import { AjustesModeFrecuencias, ClearFrecuencias, ClearFrecuenciasState } from './ajustes-frecuencias.actions';
import { AjustesFrecuenciasDePagoStateModel } from './ajustes-frecuencias.model';
import { FrecuenciaDePago } from '.prisma/client';

@State<AjustesFrecuenciasDePagoStateModel>({
    name: 'ajustesFrecuencias',
    defaults: {
        frecuencias: [],
        editMode: 'edit',
        selectedFrecuencia: undefined,
        loading: false,
    },
})
@Injectable()
export class AjustesFrecuenciasDePagoState {
    constructor(private _ajustesFrecuenciasService: AjustesFrecuenciasDePagoService) {}

    @Selector()
    static editMode({ editMode }: AjustesFrecuenciasDePagoStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static selectedSucursal({ selectedFrecuencia }: AjustesFrecuenciasDePagoStateModel): FrecuenciaDePago | undefined {
        return selectedFrecuencia;
    }

    @Selector()
    static loading({ loading }: AjustesFrecuenciasDePagoStateModel): boolean {
        return loading;
    }

    @Selector()
    static frecuencias({ frecuencias }: AjustesFrecuenciasDePagoStateModel): FrecuenciaDePago[] {
        return frecuencias;
    }

    @Action(AjustesModeFrecuencias)
    toggleEditModeFrecuencia(ctx: StateContext<AjustesFrecuenciasDePagoStateModel>, action: AjustesModeFrecuencias) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }

    @Action(ClearFrecuenciasState)
    clearSucursalState(ctx: StateContext<AjustesFrecuenciasDePagoStateModel>) {
        ctx.patchState({
            editMode: 'edit',
            selectedFrecuencia: undefined,
            loading: false,
        });
    }

    @Action(ClearFrecuencias)
    clearCreditos(ctx: StateContext<AjustesFrecuenciasDePagoStateModel>) {
        ctx.patchState({
            frecuencias: [],
        });
    }
}
