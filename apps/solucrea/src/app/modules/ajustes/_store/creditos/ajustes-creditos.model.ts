import { EditMode } from 'app/core/models';

import { Producto } from '.prisma/client';

export interface AjustesCreditosStateModel {
    creditos: Producto[] | [];
    creditosFiltered: Producto[] | [];
    editMode: EditMode;
    selectedCredito: Producto | undefined;
    loading: boolean;
}
