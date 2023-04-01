import { createPropertySelectors } from '@ngxs/store';
import { AjustesSucursalesStateModel } from './ajustes-sucursales.model';
import { AjustesSucursalesState } from './ajustes-sucursales.state';

export class AjustesSucursalesSelectors {
  static slices = createPropertySelectors<AjustesSucursalesStateModel>(AjustesSucursalesState);
}
