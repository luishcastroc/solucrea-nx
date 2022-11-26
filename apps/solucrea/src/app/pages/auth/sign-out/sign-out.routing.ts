import { Route } from '@angular/router';

export const authSignOutRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./sign-out.component').then(com => com.AuthSignOutComponent),
  },
];
