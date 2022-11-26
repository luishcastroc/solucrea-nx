import { Route } from '@angular/router';

export const mainRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./main.component').then(com => com.MainComponent),
  },
];
