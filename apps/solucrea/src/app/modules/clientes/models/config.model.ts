import {
    IGeneroReturnDto,
    ITipoDeViviendaReturnDto,
    IEstadoCivilReturnDto,
    IEscolaridadReturnDto,
} from 'api/dtos';

export interface IConfig {
    generos: IGeneroReturnDto[];
    tiposDeVivienda: ITipoDeViviendaReturnDto[];
    estadosCiviles: IEstadoCivilReturnDto[];
    escolaridades: IEscolaridadReturnDto[];
}
