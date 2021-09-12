import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { MutualcreaComponent } from './mutualcrea.component';

const mutualcreaRoutes: Route[] = [
    {
        path: '',
        component: MutualcreaComponent,
    },
];

@NgModule({
    declarations: [MutualcreaComponent],
    imports: [RouterModule.forChild(mutualcreaRoutes)],
})
export class MutualcreaModule {}
