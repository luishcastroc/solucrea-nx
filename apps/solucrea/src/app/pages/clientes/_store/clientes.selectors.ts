import { createPropertySelectors } from '@ngxs/store';
import { ClientesStateModel } from './clientes.model';
import { ClientesState } from './clientes.state';

export class ClientesSelectors {
  static slices = createPropertySelectors<ClientesStateModel>(ClientesState);
}
