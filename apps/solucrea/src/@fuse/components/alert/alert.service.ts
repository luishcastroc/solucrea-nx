import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { IAlert } from './alert.model';

@Injectable({
    providedIn: 'root',
})
export class FuseAlertService {
    private readonly _onDismiss: Subject<IAlert> = new Subject<IAlert>();
    private readonly _onShow: Subject<IAlert> = new Subject<IAlert>();

    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for onDismiss
     */
    get onDismiss(): Observable<any> {
        return this._onDismiss.asObservable();
    }

    /**
     * Getter for onShow
     */
    get onShow(): Observable<any> {
        return this._onShow.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert
     *
     * @param name
     */
    dismiss(alert: IAlert): void {
        // Return if the name is not provided
        if (!alert.name) {
            return;
        }

        // Execute the observable
        this._onDismiss.next(alert);
    }

    /**
     * Show the dismissed alert
     *
     * @param name
     */
    show(alert: IAlert): void {
        // Return if the name is not provided
        if (!alert.name) {
            return;
        }

        // Execute the observable
        this._onShow.next(alert);
    }
}
