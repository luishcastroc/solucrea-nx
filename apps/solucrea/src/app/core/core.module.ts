import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { AuthService } from 'app/core/auth/auth.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  private _domSanitizer = inject(DomSanitizer);
  private _matIconRegistry = inject(MatIconRegistry);
  private parentModule = inject(CoreModule, { optional: true, skipSelf: true });
  /**
   * Constructor
   */
  constructor() {
    // Do not allow multiple injections
    if (this.parentModule) {
      throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
    }

    const icons = [
      'material-outline',
      'material-solid',
      'iconsmind',
      'feather',
      'heroicons-outline',
      'heroicons-solid',
    ];

    // Register icon sets
    this._matIconRegistry.addSvgIconSet(
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg')
    );

    for (const icon of icons) {
      this._matIconRegistry.addSvgIconSetInNamespace(
        icon.replace('-', '_'),
        this._domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
      );
    }
  }
}
