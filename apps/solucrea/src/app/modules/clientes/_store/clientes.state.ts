import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Cliente } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos/colonia-return.dto';
import { tap } from 'rxjs/operators';

import { ClientesService } from './../clientes.service';
import { Add, GetAll, GetColonias } from './clientes.actions';
import { ClientesStateModel } from './clientes.model';

@State<ClientesStateModel>({
    name: 'clientes',
    defaults: {
        clientes: [],
        editMode: 'edit',
        selectedCliente: null,
        searchResult: [],
        colonias: [],
    },
})
@Injectable()
export class ClientesState {
    constructor(
        private clientesService: ClientesService,
        private _store: Store
    ) {}

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
    getColonias(
        ctx: StateContext<ClientesStateModel>,
        { payload }: GetColonias
    ) {
        return this.clientesService.getColoniasByCp(payload).pipe(
            tap((colonias: IColoniaReturnDto[]) => {
                ctx.patchState({ colonias });
            })
        );
    }
}
