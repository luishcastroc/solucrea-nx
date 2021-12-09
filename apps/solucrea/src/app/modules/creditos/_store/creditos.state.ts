import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ICreditoReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { GetAllCreditos } from 'app/modules/ajustes/_store';
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
    static creditosFiltered({ creditosFiltered }: CreditosStateModel): ICreditoReturnDto[] {
        return creditosFiltered;
    }

    @Selector()
    static creditos({ creditos }: CreditosStateModel): ICreditoReturnDto[] {
        return creditos;
    }

    @Selector()
    static creditosClienteFiltered({ clienteCreditosFiltered }: CreditosStateModel): ICreditoReturnDto[] {
        return clienteCreditosFiltered;
    }

    @Selector()
    static creditosCliente({ clienteCreditos }: CreditosStateModel): ICreditoReturnDto[] {
        return clienteCreditos;
    }

    @Action(GetAllCreditosCliente)
    getAllCreditosCliente(ctx: StateContext<CreditosStateModel>, { id }: GetAllCreditosCliente) {
        ctx.patchState({ loading: true });
        return this._creditosService.getCreditosCliente(id).pipe(
            tap((clienteCreditos: ICreditoReturnDto[]) => {
                const clienteCreditosFiltered = clienteCreditos.filter(
                    (credito: ICreditoReturnDto) => credito.status === 'ABIERTO'
                );
                ctx.patchState({
                    clienteCreditos,
                    clienteCreditosFiltered,
                    loading: false,
                });
            })
        );
    }

    @Action(GetAllCreditos)
    getAllCreditos(ctx: StateContext<CreditosStateModel>) {
        ctx.patchState({ loading: true });
        return this._creditosService.getCreditos().pipe(
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
