import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ReportesComponent } from './reportes.component';

const reportesRoutes: Route[] = [
  {
    path: '',
    component: ReportesComponent,
  },
];

@NgModule({
  declarations: [ReportesComponent],
  imports: [RouterModule.forChild(reportesRoutes)],
})
export class ReportesModule {}
