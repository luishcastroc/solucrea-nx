import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IClienteReturnDto, IColoniaReturnDto } from 'api/dtos';
import { sortBy } from 'lodash';
import { forkJoin, Observable, of, tap } from 'rxjs';

import { ClientesService } from '../_services/clientes.service';
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
import { ClientesStateModel } from './clientes.model';

@State<ClientesStateModel>({
  name: 'clientes',
  defaults: {
    clientes: [],
    editMode: 'new',
    selectedCliente: undefined,
    selectedActividadEconomica: undefined,
    clienteColonias: [],
    trabajoColonias: undefined,
    clientesCount: 0,
    config: undefined,
    loading: false,
  },
})
@Injectable()
export class ClientesState {
  private clientesService = inject(ClientesService);

  @Action(Search)
  searchCliente(ctx: StateContext<ClientesStateModel>, { payload }: Search) {
    ctx.patchState({ loading: true });
    let clientesReturn: Observable<IClienteReturnDto[]>;
    if (payload !== '') {
      clientesReturn = this.clientesService.getClientesWhere({ data: payload }).pipe(
        tap((clientes: IClienteReturnDto[]) => {
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
        const idx = clientes.findIndex(clienteBuscar => clienteBuscar.id === id);
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
        let clienteColonias = [...state.clienteColonias];
        let trabajoColonias = state.trabajoColonias;
        if (tipo === 'CLIENTE') {
          if (state.clienteColonias[index]) {
            clienteColonias[index] = { tipoDireccion: tipo, ubicacion: colonias };
          } else {
            clienteColonias.push({ tipoDireccion: tipo, ubicacion: colonias });
          }
        } else if (tipo === 'TRABAJO') {
          trabajoColonias = { tipoDireccion: tipo, ubicacion: colonias };
        }
        ctx.patchState({ clienteColonias, trabajoColonias });
      })
    );
  }

  @Action(RemoveColonia)
  removeColonia(ctx: StateContext<ClientesStateModel>, { index }: RemoveColonia) {
    const state = ctx.getState();
    const clienteColonias = [...state.clienteColonias];
    clienteColonias.splice(index, 1);
    ctx.patchState({ clienteColonias });
  }

  @Action(SelectActividadEconomica)
  selectActividadEconomica(ctx: StateContext<ClientesStateModel>, { id }: SelectActividadEconomica) {
    const { config } = ctx.getState();
    if (config) {
      if (config.actividadesEconomicas && config.actividadesEconomicas.length > 0) {
        const selectedActividadEconomica = config.actividadesEconomicas.filter(actividad => actividad.id === id)[0];

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
      tap(selectedCliente => {
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
        const idx = clientes.findIndex(clienteBuscar => clienteBuscar.id === id);
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
      clienteColonias: [],
      trabajoColonias: undefined,
      clientesCount: 0,
      config: undefined,
      loading: false,
    });
  }
}
