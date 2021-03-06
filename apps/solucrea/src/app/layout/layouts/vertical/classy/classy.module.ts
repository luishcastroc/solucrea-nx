import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { UserMenuModule } from 'app/layout/common/user-menu/user-menu.module';
import { ClassyLayoutComponent } from 'app/layout/layouts/vertical/classy/classy.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [ClassyLayoutComponent],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FuseNavigationModule,
        UserMenuModule,
        SharedModule,
    ],
    exports: [ClassyLayoutComponent],
})
export class ClassyLayoutModule {}
