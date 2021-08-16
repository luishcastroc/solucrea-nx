import {
    IGeneroReturnDto,
    ITipoDeViviendaReturnDto,
    IEstadoCivilReturnDto,
    IEscolaridadReturnDto,
    IActividadEconomicaReturnDto,
} from 'api/dtos';

export interface IConfig {
    generos: IGeneroReturnDto[];
    tiposDeVivienda: ITipoDeViviendaReturnDto[];
    estadosCiviles: IEstadoCivilReturnDto[];
    escolaridades: IEscolaridadReturnDto[];
    actividadesEconomicas: IActividadEconomicaReturnDto[];
}
