import { ICreditoReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export interface CreditosStateModel {
    creditos: ICreditoReturnDto[] | [];
    creditosFiltered: ICreditoReturnDto[] | [];
    clienteCreditos: ICreditoReturnDto[] | [];
    clienteCreditosFiltered: ICreditoReturnDto[] | [];
    editMode: EditMode;
    selectedCredito: ICreditoReturnDto | undefined;
    selectedClienteCredito: ICreditoReturnDto | undefined;
    loading: boolean;
}
