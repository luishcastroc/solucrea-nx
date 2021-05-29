import { Role, Sucursal } from '@prisma/client';
export interface IUsuarioRespuestaDto {
    id: number;
    nombreUsuario: string;
    nombre: string;
    apellido: string;
    role: Role;
    sucursales?: Sucursal[];
}
