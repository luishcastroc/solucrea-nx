import { IConfig } from '../models/config.model';
import { Cliente, TipoDireccion } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models/edit-mode.type';

export interface IColoniasState {
    tipoDireccion: TipoDireccion;
    ubicacion: IColoniaReturnDto;
}

export interface ClientesStateModel {
    clientes: Cliente[] | null;
    editMode: EditMode;
    selectedCliente: Cliente | null;
    searchResult: Cliente[] | [];
    colonias: IColoniasState[] | [];
    config: IConfig;
    loading: boolean;
}
