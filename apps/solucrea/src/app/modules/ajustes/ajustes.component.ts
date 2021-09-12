import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Role } from '@prisma/client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IPanel } from './models/panel.model';

/* eslint-disable arrow-parens */
@Component({
    selector: 'settings',
    templateUrl: './ajustes.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: IPanel[];
    selectedPanel: string = 'perfil';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _store: Store,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getPanelFromUrl(this._router.url, this.selectedPanel);
        // Setup available panels
        this.panels = [
            {
                id: 'perfil',
                icon: 'heroicons_outline:user-circle',
                title: 'Perfil',
                description: 'Maneja tu perfil e información pública',
                roles: [Role.ALL],
            },
            {
                id: 'seguridad',
                icon: 'heroicons_outline:lock-closed',
                title: 'Seguridad',
                description: 'Maneja tu contraseña',
                roles: [Role.ALL],
            },
            {
                id: 'usuarios',
                icon: 'heroicons_outline:user-group',
                title: 'Usuarios',
                description: 'Manejo de los usuarios y sus permisos',
                roles: [Role.ADMIN],
            },
            {
                id: 'sucursales',
                icon: 'heroicons_outline:office-building',
                title: 'Sucursales',
                description: 'Manejo de sucursales y ubicaciones',
                roles: [Role.ADMIN, Role.DIRECTOR, Role.MANAGER],
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;
        this._store.dispatch(new Navigate([`ajustes/${panel}`]));

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     *
     * @param url
     * @param panel
     */

    private getPanelFromUrl(url: string, panel: string): void {
        const urlFromBrowser = url.split('/');
        if (panel !== urlFromBrowser[2]) {
            this.selectedPanel = urlFromBrowser[2];
        }
    }
}
