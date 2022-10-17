import { IModalidadSeguroReturnDto, ISeguroReturnDto } from 'api/dtos';

export interface ISegurosData {
  seguros: ISeguroReturnDto[];
  modalidadesDeSeguro: IModalidadSeguroReturnDto[];
}
