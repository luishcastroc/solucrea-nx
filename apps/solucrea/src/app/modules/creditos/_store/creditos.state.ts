import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { tap } from 'rxjs';

import { CreditosService } from '../_services/creditos.service';
import { GetAllCreditosCliente } from './creditos.actions';
import { CreditosStateModel } from './creditos.model';

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
    static selectedCredito({ selectedCredito }: CreditosStateModel): ICreditoReturnDto | undefined {
        return selectedCredito;
    }

    @Selector()
    static loading({ loading }: CreditosStateModel): boolean {
        return loading;
    }

    @Selector()
    static creditos({ creditosFiltered }: CreditosStateModel): ICreditoReturnDto[] {
        return creditosFiltered;
    }

    @Action(GetAllCreditosCliente)
    getAllCreditos(ctx: StateContext<CreditosStateModel>, { id }: GetAllCreditosCliente) {
        ctx.patchState({ loading: true });
        return this._creditosService.getCreditosCliente(id).pipe(
            tap((creditos: ICreditoReturnDto[]) => {
                const creditosFiltered = creditos.filter((credito: ICreditoReturnDto) => credito.status === 'ABIERTO');
                ctx.patchState({
                    creditos,
                    creditosFiltered,
                    loading: false,
                });
            })
        );
    }
}
