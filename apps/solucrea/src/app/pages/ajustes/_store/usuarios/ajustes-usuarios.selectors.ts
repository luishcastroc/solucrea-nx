import { createPropertySelectors } from '@ngxs/store';
import { AjustesUsuariosStateModel } from './ajustes-usuarios.model';
import { AjustesUsuariosState } from './ajustes-usuarios.state';

export class AjustesUsuariosSelectors {
  static slices = createPropertySelectors<AjustesUsuariosStateModel>(AjustesUsuariosState);
}
