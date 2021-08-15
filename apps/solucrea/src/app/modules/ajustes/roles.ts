import { Role } from '@prisma/client';
export const defaultRoles = [
    {
        label: 'Administrador',
        value: Role.ADMIN,
        description: 'Tiene permisos para hacer todo, puede borrar, agregar o editar información.',
    },
    {
        label: 'Cajero',
        value: Role.CAJERO,
        description: 'Puede realizar operaciones generales de caja.',
    },
    {
        label: 'Director',
        value: Role.DIRECTOR,
        description: 'Tiene mayoria de permisos a excepcion de manejo de usuarios.',
    },
    {
        label: 'Gerente',
        value: Role.MANAGER,
        description: 'Permisos generales y manejo de dinero.',
    },
    {
        label: 'Usuario',
        value: Role.USUARIO,
        description: 'Usuario general con permisos mínimos.',
    },
];
