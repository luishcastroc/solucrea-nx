import { Prisma, Role } from '@prisma/client';
export class CreateUsuarioDto implements Prisma.UsuarioCreateInput {
    nombreUsuario: string;
    password: string;
    nombre: string;
    apellido: string;
    role?: Role = Role.USUARIO;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
