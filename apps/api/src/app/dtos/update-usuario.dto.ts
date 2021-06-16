import { Prisma, Role } from '@prisma/client';
export class UpdateUsuarioDto implements Prisma.UsuarioUpdateInput {
    nombreUsuario?: string;
    password?: string;
    nombre?: string;
    apellido?: string;
    oldPassword?: string;
    role?: Role = Role.USUARIO;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
