import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { CajasState } from './_store/caja.state';
import { CajaDetailComponent } from './caja-detail/caja-detail.component';
import { CajaListComponent } from './caja-list/caja-list.component';
import { CajaComponent } from './caja.component';
import { cajaRoutes } from './creditos.routing';

@NgModule({
    declarations: [CajaComponent, CajaListComponent, CajaDetailComponent],
    imports: [RouterModule.forChild(cajaRoutes), NgxsModule.forFeature([CajasState])],
})
export class CajaModule {}
