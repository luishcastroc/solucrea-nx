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
    {
        label: 'Cobrador',
        value: Role.COBRADOR,
        description: 'Encargado de cobros a clientes.',
    },
    {
        label: 'Colocador',
        value: Role.COLOCADOR,
        description: 'Promociona el uso de los créditos entre clientes.',
    },
    {
        label: 'Secretario',
        value: Role.SECRETARIO,
        description: 'Encargado/a de actividades generales.',
    },
];
