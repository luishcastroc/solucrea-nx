import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { IActividadEconomicaReturnDto, IClienteReturnDto, IColoniaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { forkJoin, tap } from 'rxjs';

import { ClientesService } from '../_services/clientes.service';
import { IConfig } from '../models/config.model';
import {
    Add,
    ClearClientesState,
    ClientesMode,
    Edit,
    GetAll,
    GetColonias,
    GetConfig,
    Inactivate,
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
        selectedCliente: undefined,
        selectedActividadEconomica: undefined,
        colonias: [],
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
    getAllClientes(ctx: StateContext<ClientesStateModel>) {
        ctx.patchState({ loading: true });
        return this.clientesService.getClientes().pipe(
            tap((clientes: IClienteReturnDto[]) => {
                if (clientes) {
                    ctx.patchState({
                        clientes,
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
            editMode: 'edit',
            selectedCliente: undefined,
            selectedActividadEconomica: undefined,
            colonias: [],
            config: undefined,
            loading: false,
        });
    }
}
