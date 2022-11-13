/* eslint-disable arrow-parens */
import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
} from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseConfigModule } from '@fuse/services/config';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { AuthState } from 'app/core/auth';
import { appConfig } from 'app/core/config/app.config';
import { CoreModule } from 'app/core/core.module';
import { environment } from 'apps/solucrea/src/environments/environment';
import { MarkdownModule } from 'ngx-markdown';

import { FuseModule } from './@fuse';

registerLocaleData(localeEsMx, 'es-Mx');

if (environment.production) {
  enableProdMode();
}

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: PreloadAllModules,
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      MatDialogModule,
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(appRoutes, routerConfig),

      // Fuse & Fuse Mock API
      FuseModule,
      FuseConfigModule.forRoot(appConfig),

      // Core
      CoreModule,

      // Layout
      LayoutModule,

      // 3rd party modules
      MarkdownModule.forRoot({}),
      NgxsModule.forRoot([AuthState], {
        developmentMode: !environment.production,
      }),
      NgxsStoragePluginModule.forRoot({
        key: [
          'auth',
          'ajustesSucursales',
          'ajustesCreditos',
          'ajustesUsuarios',
          'caja',
          'creditos',
        ],
      }),
      NgxsRouterPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      HotToastModule.forRoot()
    ),
    { provide: LOCALE_ID, useValue: 'es-Mx' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
    },
  ],
}).catch(err => console.error(err));
