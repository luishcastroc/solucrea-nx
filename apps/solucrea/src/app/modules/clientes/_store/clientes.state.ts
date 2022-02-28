import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { IActividadEconomicaReturnDto, IClienteReturnDto, IColoniaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { sortBy } from 'lodash';
import { forkJoin, tap, Observable, of } from 'rxjs';

import { ClientesService } from '../_services/clientes.service';
import { IConfig } from '../models/config.model';
import {
    Add,
    ClearClientesState,
    ClientesMode,
    Edit,
    GetAllCount,
    GetColonias,
    GetConfig,
    Inactivate,
    RemoveColonia,
    Search,
    SelectActividadEconomica,
    SelectCliente,
} from './clientes.actions';
import { ClientesStateModel, IColoniasState } from './clientes.model';

@State<ClientesStateModel>({
    name: 'clientes',
    defaults: {
        clientes: [],
        editMode: 'new',
        selectedCliente: undefined,
        selectedActividadEconomica: undefined,
        colonias: [],
        clientesCount: 0,
        config: undefined,
        loading: false,
    },
})
@Injectable()
export class ClientesState {
    constructor(private clientesService: ClientesService, private _store: Store) {}

    @Selector()
    static editMode({ editMode }: ClientesStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static selectedCliente({ selectedCliente }: ClientesStateModel): IClienteReturnDto | undefined {
        return selectedCliente;
    }

    @Selector()
    static clientes({ clientes }: ClientesStateModel): IClienteReturnDto[] {
        return clientes;
    }

    @Selector()
    static config({ config }: ClientesStateModel): IConfig | undefined {
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
    static clientesCount({ clientesCount }: ClientesStateModel): number | undefined {
        return clientesCount;
    }

    @Selector()
    static selectedActividadEconomica({
        selectedActividadEconomica,
    }: ClientesStateModel): IActividadEconomicaReturnDto | undefined {
        return selectedActividadEconomica;
    }

    @Action(Search)
    searchCliente(ctx: StateContext<ClientesStateModel>, { payload }: Search) {
        ctx.patchState({ loading: true });
        let clientesReturn: Observable<IClienteReturnDto[]>;
        if (payload !== '') {
            clientesReturn = this.clientesService.getClientesWhere({ data: payload }).pipe(
                tap((clientes: IClienteReturnDto[]) => {
                    console.log('clientes: ', clientes);
                    ctx.patchState({ clientes, loading: false });
                })
            );
        } else {
            clientesReturn = of([]);
            ctx.patchState({ clientes: [], loading: false });
        }
        return clientesReturn;
    }

    @Action(GetAllCount)
    getAllClientes(ctx: StateContext<ClientesStateModel>) {
        ctx.patchState({ loading: true });
        return this.clientesService.getClientesCount().pipe(
            tap((clientesCount: number) => {
                if (clientesCount) {
                    ctx.patchState({
                        clientesCount,
                        loading: false,
                    });
                }
            })
        );
    }

    @Action(Add)
    addCliente(ctx: StateContext<ClientesStateModel>, action: Add) {
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

    @Action(Edit)
    editClient(ctx: StateContext<ClientesStateModel>, { id, payload }: Edit) {
        return this.clientesService.editCliente(id, payload).pipe(
            tap((cliente: IClienteReturnDto) => {
                const state = ctx.getState();
                const clientes = [...state.clientes];
                const idx = clientes.findIndex((clienteBuscar) => clienteBuscar.id === id);
                clientes[idx] = cliente;

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
                    colonias = { ...colonias, colonias: sortBy(colonias.colonias, 'descripcion') };
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
        const { config } = ctx.getState();
        if (config) {
            if (config.actividadesEconomicas && config.actividadesEconomicas.length > 0) {
                const selectedActividadEconomica = config.actividadesEconomicas.filter(
                    (actividad) => actividad.id === id
                )[0];

                ctx.patchState({ selectedActividadEconomica });
            }
        }
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
                    generos: sortBy(generos, 'descripcion'),
                    estadosCiviles: sortBy(estadosCiviles, 'descripcion'),
                    escolaridades: sortBy(escolaridades, 'descripcion'),
                    tiposDeVivienda: sortBy(tiposDeVivienda, 'descripcion'),
                    actividadesEconomicas: sortBy(actividadesEconomicas, 'descripcion'),
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

    @Action(Inactivate)
    inactivateCliente(ctx: StateContext<ClientesStateModel>, { id }: Inactivate) {
        return this.clientesService.inactivateCliente(id).pipe(
            tap((cliente: IClienteReturnDto) => {
                const state = ctx.getState();
                const clientes = [...state.clientes];
                const idx = clientes.findIndex((clienteBuscar) => clienteBuscar.id === id);
                clientes[idx] = cliente;

                ctx.patchState({ clientes });
            })
        );
    }

    @Action(ClearClientesState)
    clearState(ctx: StateContext<ClientesStateModel>) {
        ctx.patchState({
            clientes: [],
            editMode: 'new',
            selectedCliente: undefined,
            selectedActividadEconomica: undefined,
            colonias: [],
            config: undefined,
            loading: false,
        });
    }
}
