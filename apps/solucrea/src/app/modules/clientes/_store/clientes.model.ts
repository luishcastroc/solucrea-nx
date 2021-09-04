import { TipoDireccion } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos';
import { IActividadEconomicaReturnDto, IClienteReturnDto } from 'api/dtos/';
import { EditMode } from 'app/core/models/edit-mode.type';

import { IConfig } from '../models/config.model';

export interface IColoniasState {
    tipoDireccion: TipoDireccion;
    ubicacion: IColoniaReturnDto;
}

export interface ClientesStateModel {
    clientes: IClienteReturnDto[] | null;
    editMode: EditMode;
    selectedCliente: IClienteReturnDto | null;
    selectedActividadEconomica: IActividadEconomicaReturnDto;
    colonias: IColoniasState[] | [];
    config: IConfig;
    loading: boolean;
}
