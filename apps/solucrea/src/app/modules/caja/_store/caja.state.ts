import { tap } from 'rxjs/operators';
import { ICajaReturnDto } from 'api/dtos';
import { Injectable } from '@angular/core';
import { Selector, State, Store, Action, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';
import { CajaService } from '../_services/caja.service';
import { CajaStateModel } from './caja.model';
import { GetAll } from './caja.actions';

@State<CajaStateModel>({
    name: 'caja',
    defaults: {
        cajas: undefined,
        editMode: 'edit',
        selectedCaja: undefined,
        loading: false,
    },
})
@Injectable()
export class CajasState {
    constructor(private _cajasService: CajaService, private _store: Store) {}

    @Selector()
    static editMode({ editMode }: CajaStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static cajas({ cajas }: CajaStateModel): ICajaReturnDto[] {
        return cajas;
    }

    @Action(GetAll)
    getAllCajas(ctx: StateContext<CajaStateModel>) {
        return this._cajasService.getCajas().pipe(
            tap((cajas: ICajaReturnDto[]) => {
                if (cajas) {
                    ctx.patchState({
                        cajas,
                    });
                }
            })
        );
    }
}
