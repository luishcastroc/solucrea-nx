import { MovimientoDeCaja } from '@prisma/client';
import { ICajaReturnDto, ISucursalReturnDto } from 'api/dtos';
import { EditMode } from 'app/core/models';

export interface CajaStateModel {
  cajas: ICajaReturnDto[] | [];
  sucursales: ISucursalReturnDto[] | [];
  movimientos: MovimientoDeCaja[] | [];
  selectedCaja: ICajaReturnDto | undefined;
  editMode: EditMode;
  loading: boolean;
}
