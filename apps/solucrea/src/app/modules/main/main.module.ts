import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from 'app/modules/main/main.component';

const mainRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
    },
];

@NgModule({
    declarations: [MainComponent],
    imports: [RouterModule.forChild(mainRoutes)],
})
export class MainModule {}
