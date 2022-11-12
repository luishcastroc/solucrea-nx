import { ModuleWithProviders, NgModule } from '@angular/core';
import { FUSE_APP_CONFIG } from '@fuse/services/config/config.constants';

@NgModule()
export class FuseConfigModule {
  /**
   * forRoot method for setting user configuration
   *
   * @param config
   */
  static forRoot(config: any): ModuleWithProviders<FuseConfigModule> {
    return {
      ngModule: FuseConfigModule,
      providers: [
        {
          provide: FUSE_APP_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
