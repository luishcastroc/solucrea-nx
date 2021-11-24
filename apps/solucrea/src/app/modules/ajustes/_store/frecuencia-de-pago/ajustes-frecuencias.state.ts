import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FrecuenciaDePago } from '@prisma/client';
import { EditMode } from 'app/core/models';
import { AjustesFrecuenciasDePagoService } from 'app/modules/ajustes/_services';
import { tap } from 'rxjs';

import {
    AjustesModeFrecuencias,
    ClearFrecuencias,
    ClearFrecuenciasState,
    GetAllFrecuenciass,
} from './ajustes-frecuencias.actions';
import { AjustesFrecuenciasDePagoStateModel } from './ajustes-frecuencias.model';

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

    @Action(GetAllFrecuenciass)
    getAllFrecuencias(ctx: StateContext<AjustesFrecuenciasDePagoStateModel>) {
        ctx.patchState({ loading: true });
        return this._ajustesFrecuenciasService.getFrecuenciasDePago().pipe(
            tap((frecuencias: FrecuenciaDePago[]) => {
                if (frecuencias) {
                    ctx.patchState({ frecuencias, loading: false });
                }
            })
        );
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
