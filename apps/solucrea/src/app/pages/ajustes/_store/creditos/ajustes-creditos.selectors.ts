import { createPropertySelectors } from '@ngxs/store';
import { AjustesCreditosStateModel } from './ajustes-creditos.model';
import { AjustesCreditosState } from './ajustes-creditos.state';

export class AjustesCreditosSelectors {
  static slices = createPropertySelectors<AjustesCreditosStateModel>(AjustesCreditosState);
}
