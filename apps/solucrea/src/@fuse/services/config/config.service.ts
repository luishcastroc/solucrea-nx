import { inject, Inject, Injectable } from '@angular/core';
import { FUSE_APP_CONFIG } from '@fuse/services/config/config.constants';
import { merge } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuseConfigService {
  appConfig = inject(FUSE_APP_CONFIG);
  private _config: BehaviorSubject<any>;

  /**
   * Constructor
   */
  constructor() {
    // Private
    this._config = new BehaviorSubject(this.appConfig);
  }

  get config$(): Observable<any> {
    return this._config.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for config
   */
  set config(value: any) {
    // Merge the new config over to the current config
    const config = merge({}, this._config.getValue(), value);

    // Execute the observable
    this._config.next(config);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resets the config to the default
   */
  reset(): void {
    // Set the config
    this._config.next(this.config);
  }
}
