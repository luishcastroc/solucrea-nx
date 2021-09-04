import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { IActividadEconomicaReturnDto, IClienteReturnDto, IColoniaReturnDto } from 'api/dtos';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ClientesService } from '../clientes.service';
import { IConfig } from '../models/config.model';
import {
    Add,
    ClearClientesState,
    ClientesMode,
    GetAll,
    GetColonias,
    GetConfig,
    RemoveColonia,
    SelectActividadEconomica,
    SelectCliente,
} from './clientes.actions';
import { ClientesStateModel, IColoniasState } from './clientes.model';

@State<ClientesStateModel>({
    name: 'clientes',
    defaults: {
        clientes: [],
        editMode: 'edit',
        selectedCliente: null,
        selectedActividadEconomica: null,
        colonias: [],
        config: null,
        loading: false,
    },
})
@Injectable()
export class ClientesState {
    constructor(private clientesService: ClientesService, private _store: Store) {}

    @Selector()
    static editMode({ editMode }: ClientesStateModel): string {
        return editMode;
    }

    @Selector()
    static selectedCliente({ selectedCliente }: ClientesStateModel): IClienteReturnDto {
        return selectedCliente;
    }

    @Selector()
    static clientes({ clientes }: ClientesStateModel): IClienteReturnDto[] {
        return clientes;
    }

    @Selector()
    static config({ config }: ClientesStateModel): IConfig {
        return config;
    }

    @Selector()
    static loading({ loading }: ClientesStateModel): boolean {
        return loading;
    }

    @Selector()
    static colonias({ colonias }: ClientesStateModel): IColoniasState[] {
        return colonias;
    }

    @Selector()
    static selectedActividadEconomica({
        selectedActividadEconomica,
    }: ClientesStateModel): IActividadEconomicaReturnDto {
        return selectedActividadEconomica;
    }

    @Action(GetAll)
    getAllUsuarios(ctx: StateContext<ClientesStateModel>) {
        return this.clientesService.getClientes().pipe(
            tap((clientes: IClienteReturnDto[]) => {
                if (clientes) {
                    ctx.patchState({
                        clientes,
                    });
                }
            })
        );
    }

    @Action(Add)
    addUsuario(ctx: StateContext<ClientesStateModel>, action: Add) {
        const { payload } = action;
        return this.clientesService.addCliente(payload).pipe(
            tap((cliente: IClienteReturnDto) => {
                const state = ctx.getState();
                const clientes = [...state.clientes];
                clientes.push(cliente);

                ctx.patchState({ clientes });
            })
        );
    }

    @Action(GetColonias)
    getColonias(ctx: StateContext<ClientesStateModel>, { cp, index, tipo }: GetColonias) {
        return this.clientesService.getColoniasByCp(cp).pipe(
            tap((colonias: IColoniaReturnDto) => {
                const state = ctx.getState();
                if (state.colonias) {
                    const coloniasState = [...state.colonias];
                    if (index >= 0) {
                        coloniasState[index] = { tipoDireccion: tipo, ubicacion: colonias };
                    } else {
                        const idx = coloniasState.findIndex((colonia) => colonia.tipoDireccion === 'TRABAJO');
                        if (idx === -1) {
                            coloniasState.push({ tipoDireccion: tipo, ubicacion: colonias });
                        } else {
                            coloniasState[idx] = { tipoDireccion: tipo, ubicacion: colonias };
                        }
                    }

                    ctx.patchState({
                        colonias: coloniasState,
                    });
                }
            })
        );
    }

    @Action(RemoveColonia)
    removeColonia(ctx: StateContext<ClientesStateModel>, { index }: RemoveColonia) {
        const state = ctx.getState();
        const colonias = [...state.colonias];
        colonias.splice(index, 1);
        ctx.patchState({ colonias });
    }

    @Action(SelectActividadEconomica)
    selectActividadEconomica(ctx: StateContext<ClientesStateModel>, { id }: SelectActividadEconomica) {
        const state = ctx.getState();
        const selectedActividadEconomica = state.config.actividadesEconomicas.filter(
            (actividad) => actividad.id === id
        )[0];
        ctx.patchState({ selectedActividadEconomica });
    }

    @Action(GetConfig)
    getConfig(ctx: StateContext<ClientesStateModel>) {
        let loading = true;
        ctx.patchState({ loading });
        return forkJoin({
            generos: this.clientesService.getGeneros(),
            estadosCiviles: this.clientesService.getEstadosCiviles(),
            escolaridades: this.clientesService.getEscolaridades(),
            tiposDeVivienda: this.clientesService.getTiposDeVivienda(),
            actividadesEconomicas: this.clientesService.getActividadesEconomicas(),
        }).pipe(
            tap(({ generos, estadosCiviles, escolaridades, tiposDeVivienda, actividadesEconomicas }) => {
                const config = {
                    generos,
                    estadosCiviles,
                    escolaridades,
                    tiposDeVivienda,
                    actividadesEconomicas,
                };
                loading = false;
                ctx.patchState({ config, loading });
            })
        );
    }

    @Action(ClientesMode)
    clientesMode(ctx: StateContext<ClientesStateModel>, { payload }: ClientesMode) {
        const editMode = payload;
        ctx.patchState({ editMode });
    }

    @Action(SelectCliente)
    selectCliente(ctx: StateContext<ClientesStateModel>, { id }: SelectCliente) {
        return this.clientesService.getCliente(id).pipe(
            tap((selectedCliente) => {
                ctx.patchState({ selectedCliente });
            })
        );
    }

    @Action(ClearClientesState)
    clearState(ctx: StateContext<ClientesStateModel>) {
        ctx.patchState({
            clientes: [],
            editMode: 'edit',
            selectedCliente: null,
            colonias: [],
            config: null,
            loading: false,
        });
    }
}
