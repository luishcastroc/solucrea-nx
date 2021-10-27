import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ICajaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';
import { AjustesSucursalService } from 'app/modules/ajustes/_services';
import { tap } from 'rxjs/operators';

import { CajaService } from '../_services/caja.service';
import { Add, GetAll, GetAllSucursales, SelectCaja, CajasMode } from './caja.actions';
import { CajaStateModel } from './caja.model';

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

    @Selector()
    static selectedCaja({ selectedCaja }: CajaStateModel): ICajaReturnDto {
        return selectedCaja;
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

    @Action(SelectCaja)
    selectCaja(ctx: StateContext<CajaStateModel>, { id }: SelectCaja) {
        return this._cajasService.getCaja(id).pipe(
            tap((selectedCaja: ICajaReturnDto) => {
                if (selectedCaja) {
                    ctx.patchState({
                        selectedCaja,
                    });
                }
            })
        );
    }

    @Action(CajasMode)
    toggleEditModeSucursal(ctx: StateContext<CajaStateModel>, action: CajasMode) {
        const { payload } = action;
        ctx.patchState({ editMode: payload });
    }
}
