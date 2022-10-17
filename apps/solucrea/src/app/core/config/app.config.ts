import { Role } from '@prisma/client';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Layout } from 'app/layout/layout.types';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig {
  layout: Layout;
  scheme: Scheme;
  screens: Screens;
  theme: Theme;
  themes: Themes;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 *
 * "Screens" are carried over to the BreakpointObserver for accessing them within
 * components, and they are required.
 *
 * "Themes" are required for Tailwind to generate themes.
 */
export const appConfig: AppConfig = {
  layout: 'classy',
  scheme: 'light',
  screens: {
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1440px',
  },
  theme: 'theme-default',
  themes: [
    {
      id: 'theme-default',
      name: 'Default',
    },
    {
      id: 'theme-brand',
      name: 'Brand',
    },
    {
      id: 'theme-teal',
      name: 'Teal',
    },
    {
      id: 'theme-rose',
      name: 'Rose',
    },
    {
      id: 'theme-purple',
      name: 'Purple',
    },
    {
      id: 'theme-amber',
      name: 'Amber',
    },
  ],
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
