import { createPropertySelectors } from '@ngxs/store';
import { CajaStateModel } from './caja.model';
import { CajasState } from './caja.state';

export class CajaSelectors {
  static slices = createPropertySelectors<CajaStateModel>(CajasState);
}
