import { createPropertySelectors } from '@ngxs/store';
import { CreditosStateModel } from './creditos.model';
import { CreditosState } from './creditos.state';

export class CreditosSelectors {
  static slices = createPropertySelectors<CreditosStateModel>(CreditosState);
}
