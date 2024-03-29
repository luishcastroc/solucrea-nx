import { Prisma } from '@prisma/client';

export const selectCliente = {
  id: true,
  nombre: true,
  apellidoPaterno: true,
  apellidoMaterno: true,
  fechaDeNacimiento: true,
  rfc: true,
  curp: true,
  genero: { select: { id: true, descripcion: true } },
  escolaridad: { select: { id: true, descripcion: true } },
  estadoCivil: { select: { id: true, descripcion: true } },
  tipoDeVivienda: { select: { id: true, descripcion: true } },
  montoMinimo: true,
  montoMaximo: true,
  numeroCreditosCrecer: true,
  multiplos: true,
  porcentajeDePagos: true,
  porcentajeDeMora: true,
  telefono1: true,
  telefono2: true,
  direcciones: {
    select: {
      id: true,
      calle: true,
      numero: true,
      cruzamientos: true,
      colonia: { select: { id: true, descripcion: true, codigoPostal: true } },
    },
  },
  trabajo: {
    select: {
      id: true,
      nombre: true,
      antiguedad: true,
      actividadEconomica: {
        select: { id: true, descripcion: true, montoMin: true, montoMax: true },
      },
      telefono: true,
      direccion: {
        select: {
          id: true,
          calle: true,
          numero: true,
          cruzamientos: true,
          colonia: {
            select: { id: true, descripcion: true, codigoPostal: true },
          },
        },
      },
    },
  },
  activo: true,
};

export const includeCredito: Prisma.CreditoInclude = {
  cliente: {
    select: {
      id: true,
      nombre: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      fechaDeNacimiento: true,
      rfc: true,
      curp: true,
      genero: { select: { id: true, descripcion: true } },
      escolaridad: { select: { id: true, descripcion: true } },
      estadoCivil: { select: { id: true, descripcion: true } },
      tipoDeVivienda: { select: { id: true, descripcion: true } },
      montoMinimo: true,
      montoMaximo: true,
      numeroCreditosCrecer: true,
      multiplos: true,
      porcentajeDePagos: true,
      porcentajeDeMora: true,
      telefono1: true,
      telefono2: true,
      direcciones: {
        select: {
          id: true,
          calle: true,
          numero: true,
          cruzamientos: true,
          colonia: {
            select: { id: true, descripcion: true, codigoPostal: true },
          },
        },
      },
      trabajo: {
        select: {
          id: true,
          nombre: true,
          antiguedad: true,
          actividadEconomica: {
            select: {
              id: true,
              descripcion: true,
              montoMin: true,
              montoMax: true,
            },
          },
          telefono: true,
          direccion: {
            select: {
              id: true,
              calle: true,
              numero: true,
              cruzamientos: true,
              colonia: {
                select: { id: true, descripcion: true, codigoPostal: true },
              },
            },
          },
        },
      },
      activo: true,
    },
  },
  pagos: {
    orderBy: { fechaDePago: 'asc' },
    select: {
      id: true,
      monto: true,
      tipoDePago: true,
      fechaDePago: true,
      observaciones: true,
    },
  },
  producto: {
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      montoMinimo: true,
      montoMaximo: true,
      interes: true,
      interesMoratorio: true,
      penalizacion: true,
      comision: true,
      cargos: true,
      activo: true,
      numeroDePagos: true,
      frecuencia: true,
      creditosActivos: true,
      diaSemana: true,
      diaMes: true,
    },
  },
  sucursal: { select: { id: true, nombre: true } },
  seguro: { select: { id: true, nombre: true, monto: true } },
  modalidadDeSeguro: { select: { id: true, titulo: true, descripcion: true } },
  aval: {
    select: {
      id: true,
      nombre: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      telefono: true,
      fechaDeNacimiento: true,
      parentesco: { select: { id: true, descripcion: true } },
      otro: true,
      ocupacion: true,
    },
  },
  colocador: {
    select: {
      id: true,
      usuario: { select: { id: true, nombre: true, apellido: true } },
      cliente: {
        select: {
          id: true,
          apellidoPaterno: true,
          apellidoMaterno: true,
          nombre: true,
        },
      },
    },
  },
};
