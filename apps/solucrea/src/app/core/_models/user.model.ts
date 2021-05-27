import { ISucursal } from './sucursal.model';

export enum Role {
    usuario = 'USUARIO',
    admin = 'ADMIN',
    director = 'DIRECTOR',
    cajero = 'CAJERO',
    manager = 'MANAGER',
    secre = 'SECRE',
    all = 'ALL',
}

export interface User {
    id: number;
    nombreUsuario: string;
    nombre?: string;
    apellido?: string;
    role?: Role;
    sucursal?: ISucursal;
}
