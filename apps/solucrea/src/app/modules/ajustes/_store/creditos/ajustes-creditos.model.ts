import { Producto } from '@prisma/client';
import { EditMode } from 'app/core/models';

export interface AjustesCreditosStateModel {
    creditos: Producto[] | [];
    creditosFiltered: Producto[] | [];
    editMode: EditMode;
    selectedCredito: Producto | undefined;
    loading: boolean;
}
