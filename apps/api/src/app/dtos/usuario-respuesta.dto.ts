import { Role, Sucursal } from '@prisma/client';
export interface IUsuarioRespuestaDto {
    id: string;
    nombreUsuario: string;
    nombre: string;
    apellido: string;
    role: Role;
    sucursales?: Sucursal[];
}
