import { Role } from '@prisma/client';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Layout } from 'app/layout/layout.types';

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
        roles: [Role.ALL],
        children: [
            {
                id: 'menu.clientes',
                title: 'Clientes',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/clientes',
                roles: [Role.ALL],
            },
            {
                id: 'menu.productos',
                title: 'Productos',
                type: 'collapsable',
                icon: 'heroicons_outline:briefcase',
                link: '/creditos',
                roles: [Role.ALL],
                children: [
                    {
                        id: 'menu.productos.creditos',
                        title: 'Créditos',
                        type: 'basic',
                        icon: 'heroicons_outline:credit-card',
                        link: '/creditos',
                        roles: [Role.ALL],
                    },
                    {
                        id: 'menu.productos.mutualcrea',
                        title: 'Mutualcrea',
                        type: 'basic',
                        icon: 'heroicons_outline:user-group',
                        link: '/mutualcrea',
                        roles: [Role.ALL],
                    },
                ],
            },
            {
                id: 'menu.reportes',
                title: 'Reportes',
                type: 'basic',
                icon: 'heroicons_outline:document-report',
                link: '/reportes',
                roles: [Role.ALL],
            },
            {
                id: 'menu.caja',
                title: 'Caja',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/caja',
                roles: [Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER],
            },
            {
                id: 'menu.ajustes',
                title: 'Ajustes',
                type: 'basic',
                icon: 'heroicons_outline:adjustments',
                link: '/ajustes',
                roles: [Role.ALL],
            },
        ],
    },
];
