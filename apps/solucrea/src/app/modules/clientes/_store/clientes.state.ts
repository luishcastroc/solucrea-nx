import { IConfig } from '../models/config.model';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Cliente } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos';
import { tap } from 'rxjs/operators';

import { ClientesService } from '../clientes.service';
import { Add, GetAll, GetColonias, GetConfig, ClearClientesState, RemoveColonia } from './clientes.actions';
import { ClientesStateModel, IColoniasState } from './clientes.model';
import { forkJoin } from 'rxjs';

@State<ClientesStateModel>({
    name: 'clientes',
    defaults: {
        clientes: [],
        editMode: 'edit',
        selectedCliente: null,
        searchResult: [],
        colonias: [],
        config: null,
        loading: false,
    },
})
@Injectable()
export class ClientesState {
    constructor(private clientesService: ClientesService, private _store: Store) {}

    @Selector()
    static searchResults({ searchResult }: ClientesStateModel): Cliente[] | [] {
        return searchResult;
    }

    @Selector()
    static editMode({ editMode }: ClientesStateModel): string {
        return editMode;
    }

    @Selector()
    static selectedUsuario({ selectedCliente }: ClientesStateModel): Cliente {
        return selectedCliente;
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

    @Action(GetAll)
    getAllUsuarios(ctx: StateContext<ClientesStateModel>, action: GetAll) {
        const { id } = action;
        return this.clientesService.getClientes().pipe(
            tap((clientes: Cliente[]) => {
                if (clientes) {
                    ctx.patchState({
                        clientes,
                        searchResult: clientes,
                    });
                }
            })
        );
    }

    @Action(Add)
    addUsuario(ctx: StateContext<ClientesStateModel>, action: Add) {
        const { payload } = action;
        return this.clientesService.addCliente(payload).pipe(
            tap((cliente: Cliente) => {
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
                    if (index) {
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

    @Action(ClearClientesState)
    clearState(ctx: StateContext<ClientesStateModel>) {
        ctx.patchState({
            clientes: [],
            editMode: 'edit',
            selectedCliente: null,
            searchResult: [],
            colonias: [],
            config: null,
            loading: false,
        });
    }
}
