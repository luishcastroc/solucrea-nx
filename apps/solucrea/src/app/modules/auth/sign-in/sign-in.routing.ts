import { Route } from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';

export const authSignInRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./sign-in.component').then(com => com.AuthSignInComponent),
  },
];
