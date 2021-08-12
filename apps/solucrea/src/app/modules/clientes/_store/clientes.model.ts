import { IConfig } from '../models/config.model';
import { Cliente } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models/edit-mode.type';

export interface ClientesStateModel {
    clientes: Cliente[] | null;
    editMode: EditMode;
    selectedCliente: Cliente | null;
    searchResult: Cliente[] | [];
    colonias: IColoniaReturnDto[] | [];
    config: IConfig;
    loading: boolean;
}
