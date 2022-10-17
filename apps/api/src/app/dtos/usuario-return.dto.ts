import { Role, Sucursal } from '@prisma/client';
export interface IUsuarioReturnDto {
  id: string;
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  role: Role;
  sucursales?: Sucursal[];
}
