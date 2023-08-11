import { Prisma } from '@prisma/client';
import { CreateDireccionDto, IDireccion } from 'api/dtos/';
export interface IDireccionUpdateDto {
  deleteDireccion?: Prisma.DireccionWhereUniqueInput[];
  create?: CreateDireccionDto[];
  update?: IDireccion[];
}

export interface ITrabajoDto {
  id?: string;
  nombre?: string;
  telefono?: string;
  antiguedad?: number;
  direccion?: IDireccion;
  actividadEconomica?: string;
}

export class UpdateClienteDto {
  id?: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaDeNacimiento?: Date | string;
  rfc?: string;
  curp?: string;
  telefono1?: string;
  telefono2?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  numeroCreditosCrecer?: number;
  trabajo?: ITrabajoDto;
  estadoCivil?: string;
  tipoDeVivienda?: string;
  escolaridad?: string;
  genero?: string;
  direcciones?: IDireccionUpdateDto;
  actualizadoPor?: string;
  activo?: boolean;
}
