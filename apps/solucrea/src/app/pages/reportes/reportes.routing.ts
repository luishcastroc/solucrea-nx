import { Route } from '@angular/router';

export const reportesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./reportes.component').then(com => com.ReportesComponent),
  },
];
