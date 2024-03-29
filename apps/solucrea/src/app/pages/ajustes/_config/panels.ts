import { Role } from '@prisma/client';
export const ajustesPanels = [
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
    roles: [Role.ADMIN, Role.DIRECTOR],
  },
  {
    id: 'creditos',
    icon: 'heroicons_outline:library',
    title: 'Créditos',
    description: 'Catálogo de tipos de crédito',
    roles: [Role.ADMIN, Role.DIRECTOR],
  },
];
