import {
  IActividadEconomicaReturnDto,
  IEscolaridadReturnDto,
  IEstadoCivilReturnDto,
  IGeneroReturnDto,
  ITipoDeViviendaReturnDto,
} from 'api/dtos';

export interface IConfig {
  generos: IGeneroReturnDto[];
  tiposDeVivienda: ITipoDeViviendaReturnDto[];
  estadosCiviles: IEstadoCivilReturnDto[];
  escolaridades: IEscolaridadReturnDto[];
  actividadesEconomicas: IActividadEconomicaReturnDto[];
}
