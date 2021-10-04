import { EditMode } from './../../../core/models/edit-mode.type';
import { Caja } from '.prisma/client';

export interface CajaStateModel {
    cajas: Caja[] | [];
    selectedCaja: Caja;
    editMode: EditMode;
    loading: boolean;
}
