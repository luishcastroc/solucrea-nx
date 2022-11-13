import { TipoDireccion } from '@prisma/client';
import { IColoniaReturnDto } from 'api/dtos';
import { IActividadEconomicaReturnDto, IClienteReturnDto } from 'api/dtos/';
import { EditMode } from 'app/core/models';

import { IConfig } from '../models/config.model';

export interface IColoniasState {
  tipoDireccion: TipoDireccion;
  ubicacion: IColoniaReturnDto;
}

export interface ClientesStateModel {
  clientes: IClienteReturnDto[] | [];
  clientesCount: number | undefined;
  editMode: EditMode;
  selectedCliente: IClienteReturnDto | undefined;
  selectedActividadEconomica: IActividadEconomicaReturnDto | undefined;
  colonias: IColoniasState[] | [];
  config: IConfig | undefined;
  loading: boolean;
}
