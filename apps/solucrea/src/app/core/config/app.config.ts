import { FuseNavigationItem } from '@fuse/components/navigation';
import { Layout } from 'app/layout/layout.types';
import { Role } from '../_models/user.model';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Theme = 'default' | string;

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig {
    layout: Layout;
    scheme: Scheme;
    theme: Theme;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 */
export const appConfig: AppConfig = {
    layout: 'classy',
    scheme: 'light',
    theme: 'default',
};

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'menu',
        title: 'Menú',
        subtitle: 'Opciones del sistema',
        type: 'group',
        icon: 'heroicons_outline:document',
        roles: [Role.all],
        children: [
            {
                id: 'menu.clientes',
                title: 'Clientes',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/clientes',
                roles: [Role.all],
            },
            {
                id: 'menu.creditos',
                title: 'Créditos',
                type: 'basic',
                icon: 'heroicons_outline:credit-card',
                link: '/creditos',
                roles: [Role.all],
            },
            {
                id: 'menu.reportes',
                title: 'Reportes',
                type: 'basic',
                icon: 'heroicons_outline:document-report',
                link: '/reportes',
                roles: [Role.all],
            },
            {
                id: 'menu.caja',
                title: 'Caja',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/caja',
                roles: [Role.all],
            },
            {
                id: 'menu.ajustes',
                title: 'Ajustes',
                type: 'basic',
                icon: 'heroicons_outline:adjustments',
                link: '/ajustes',
                roles: [Role.admin],
            },
        ],
    },
];
