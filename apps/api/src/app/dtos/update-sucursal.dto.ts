import { IDireccion } from 'api/dtos';

export class UpdateSucursalDto {
  id?: string;
  nombre?: string;
  telefono?: string;
  creadoPor?: string;
  fechaCreacion?: Date | string;
  actualizadoPor?: string;
  fechaActualizacion?: Date | string;
  direccion?: IDireccion;
}
