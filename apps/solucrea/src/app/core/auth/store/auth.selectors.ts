import { createPropertySelectors, Selector } from '@ngxs/store';
import { AuthStateModel } from './auth.model';
import { AuthState } from './auth.state';

export class AuthStateSelectors {
  static slices = createPropertySelectors<AuthStateModel>(AuthState);

  @Selector([AuthStateSelectors.slices.accessToken])
  static isAuthenticated(accessToken: string): boolean {
    return !!accessToken;
  }
}
