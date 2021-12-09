import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';

import { CreditosService } from '../_services/creditos.service';
import { GetAllCreditosCliente } from './creditos.actions';
import { CreditosStateModel } from './creditos.model';
import { Credito } from '.prisma/client';

@State<CreditosStateModel>({
    name: 'creditos',
    defaults: {
        creditos: [],
        creditosFiltered: [],
        clienteCreditos: [],
        clienteCreditosFiltered: [],
        editMode: 'edit',
        selectedCredito: undefined,
        selectedClienteCredito: undefined,
        loading: false,
    },
})
@Injectable()
export class CreditosState {
    constructor(private _creditosService: CreditosService) {}

    @Selector()
    static editMode({ editMode }: CreditosStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static selectedCredito({ selectedCredito }: CreditosStateModel): Credito | undefined {
        return selectedCredito;
    }

    @Selector()
    static loading({ loading }: CreditosStateModel): boolean {
        return loading;
    }

    @Selector()
    static creditos({ creditosFiltered }: CreditosStateModel): Credito[] {
        return creditosFiltered;
    }

    @Action(GetAllCreditosCliente)
    getAllCreditos(ctx: StateContext<CreditosStateModel>) {
        ctx.patchState({ loading: true });
    }
}
