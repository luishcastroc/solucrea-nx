import { ISucursalReturnDto } from 'api/dtos/sucursal-return.dto';
import { tap } from 'rxjs/operators';
import { ICajaReturnDto } from 'api/dtos';
import { Injectable } from '@angular/core';
import { Selector, State, Store, Action, StateContext } from '@ngxs/store';
import { EditMode } from 'app/core/models';
import { CajaService } from '../_services/caja.service';
import { CajaStateModel } from './caja.model';
import { Add, GetAll, GetAllSucursales } from './caja.actions';
import { AjustesSucursalService } from 'app/modules/ajustes/_services';

@State<CajaStateModel>({
    name: 'caja',
    defaults: {
        cajas: [],
        sucursales: [],
        editMode: 'edit',
        selectedCaja: undefined,
        loading: false,
    },
})
@Injectable()
export class CajasState {
    constructor(
        private _cajasService: CajaService,
        private _store: Store,
        private _sucursalesService: AjustesSucursalService
    ) {}

    @Selector()
    static editMode({ editMode }: CajaStateModel): EditMode {
        return editMode;
    }

    @Selector()
    static cajas({ cajas }: CajaStateModel): ICajaReturnDto[] {
        return cajas;
    }

    @Selector()
    static sucursales({ sucursales }: CajaStateModel): ISucursalReturnDto[] {
        return sucursales;
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

    @Action(GetAllSucursales)
    getAllSucursales(ctx: StateContext<CajaStateModel>) {
        return this._sucursalesService.getSucursales().pipe(
            tap((sucursales: ISucursalReturnDto[]) => {
                if (sucursales) {
                    ctx.patchState({ sucursales });
                }
            })
        );
    }

    @Action(Add)
    addCaja(ctx: StateContext<CajaStateModel>, action: Add) {
        const { payload } = action;
        return this._cajasService.addCaja(payload).pipe(
            tap((caja: ICajaReturnDto) => {
                const state = ctx.getState();
                const cajas = [...state.cajas];
                cajas.push(caja);

                ctx.patchState({ cajas });
            })
        );
    }
}
