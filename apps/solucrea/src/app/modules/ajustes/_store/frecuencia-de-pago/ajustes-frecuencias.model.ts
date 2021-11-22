import { EditMode } from 'app/core/models';

import { FrecuenciaDePago } from '.prisma/client';

export interface AjustesFrecuenciasDePagoStateModel {
    frecuencias: FrecuenciaDePago[] | [];
    editMode: EditMode;
    selectedFrecuencia: FrecuenciaDePago | undefined;
    loading: boolean;
}
