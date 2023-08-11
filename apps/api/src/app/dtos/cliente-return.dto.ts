import { ActividadEconomica, Escolaridad, EstadoCivil, Genero, Prisma, TipoDeVivienda } from '@prisma/client';

import { IColonias } from './colonia-return.dto';

export interface IDireccionesReturnDto {
  id: string;
  calle: string;
  numero: string;
  cruzamientos: string | null;
  colonia: IColonias;
}

export interface ITrabajoReturn {
  id: string;
  nombre: string;
  antiguedad: number;
  actividadEconomica: Partial<ActividadEconomica>;
  telefono: string;
  direccion: IDireccionesReturnDto;
}

export interface IClienteReturnDto {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaDeNacimiento: Date;
  rfc: string;
  curp: string;
  genero: Partial<Genero>;
  escolaridad: Partial<Escolaridad>;
  estadoCivil: Partial<EstadoCivil>;
  tipoDeVivienda: Partial<TipoDeVivienda>;
  montoMinimo: Prisma.Decimal | number;
  montoMaximo: Prisma.Decimal | number;
  telefono1: string;
  telefono2: string | null;
  numeroCreditosCrecer: number;
  porcentajeDePagos: Prisma.Decimal | number;
  porcentajeDeMora: Prisma.Decimal | number;
  multiplos: Prisma.Decimal | number;
  direcciones: IDireccionesReturnDto[];
  trabajo: ITrabajoReturn;
  activo: boolean;
}
