import { Prisma, Role } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateUsuarioDto implements Prisma.UsuarioCreateInput {
    @IsNotEmpty({ message: 'Nombre de usuario es requerido' })
    nombreUsuario: string;
    @IsNotEmpty({ message: 'Contraseña es requerida' })
    password: string;
    @IsNotEmpty({ message: 'Nombre es requerido' })
    nombre: string;
    @IsNotEmpty({ message: 'Apellido es requerido' })
    apellido: string;
    role?: Role = Role.USUARIO;
    creadoPor?: string;
    fechaCreacion?: string | Date;
    actualizadoPor?: string;
    fechaActualizacion?: string | Date;
}
