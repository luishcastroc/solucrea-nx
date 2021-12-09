import { EditMode } from 'app/core/models';

import { Credito } from '.prisma/client';

export interface CreditosStateModel {
    creditos: Credito[] | [];
    creditosFiltered: Credito[] | [];
    clienteCreditos: Credito[] | [];
    clienteCreditosFiltered: Credito[] | [];
    editMode: EditMode;
    selectedCredito: Credito | undefined;
    selectedClienteCredito: Credito | undefined;
    loading: boolean;
}
