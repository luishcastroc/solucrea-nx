import { Route } from '@angular/router';

export const mutualcreaRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./mutualcrea.component').then(com => com.MutualcreaComponent),
  },
];
