import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Categoria, Pago, Prisma, Producto, Status } from '@prisma/client';
import {
  generateTablaAmorizacion,
  getFrecuencia,
  getPagoNoIntereses,
  getSaldoActual,
  getSaldoVencido,
} from '@solucrea-utils';
import { IAmortizacion, ICajaReturnDto, ICreditoReturnDto, StatusPago } from 'api/dtos';
import { PrismaService } from 'api/prisma';

/* eslint-disable @typescript-eslint/naming-convention */
@Injectable()
export class CreditosService {
  constructor(private prisma: PrismaService) {}

  async creditosCliente(clienteId: string, statusCredito: Status): Promise<ICreditoReturnDto[] | null> {
    try {
      const creditosCliente = await this.prisma.credito.findMany({
        where: { clienteId: { equals: clienteId } },
        include: {
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
                        select: {
                          id: true,
                          descripcion: true,
                          codigoPostal: true,
                        },
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
          modalidadDeSeguro: {
            select: { id: true, titulo: true, descripcion: true },
          },
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
        },
      });

      const creditosReturn = await Promise.all(
        creditosCliente.map(async credito => {
          const frecuencia = getFrecuencia(credito?.producto.frecuencia);
          const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
            credito?.producto.numeroDePagos as number,
            frecuencia,
            credito?.fechaInicio as string | Date,
            credito?.cuota,
            credito?.pagos as Pago[],
            credito?.cuotaMora
          );

          let status;
          if (amortizacion.some(table => table.status === StatusPago.adeuda)) {
            status = Status.MORA;
          } else if (
            amortizacion.filter(tabla => tabla.status === StatusPago.pagado).length === credito?.producto.numeroDePagos
          ) {
            status = Status.CERRADO;
          } else if (
            !amortizacion.some(tabla => tabla.status === StatusPago.adeuda) &&
            amortizacion.some(tabla => tabla.status === StatusPago.corriente)
          ) {
            status = Status.ABIERTO;
          }

          const saldoVencido = getSaldoVencido(amortizacion);

          const creditoReturn = {
            ...credito,
            amortizacion,
            status,
            saldoVencido,
          };

          if (status !== credito.status) {
            await this.prisma.credito.update({
              where: { id: credito.id },
              data: { status },
            });
          }

          return creditoReturn as ICreditoReturnDto;
        })
      );

      return creditosReturn.filter(credito => {
        if (statusCredito === 'ABIERTO' && (credito.status === 'ABIERTO' || credito.status === 'MORA')) {
          return credito;
        } else if (statusCredito === credito.status) {
          return credito;
        }
      });
    } catch (e: any) {
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error consultando los créditos del cliente',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async creditos(statusCredito: Status): Promise<ICreditoReturnDto[] | null> {
    try {
      const creditos = await this.prisma.credito.findMany({
        include: {
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
                        select: {
                          id: true,
                          descripcion: true,
                          codigoPostal: true,
                        },
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
          modalidadDeSeguro: {
            select: { id: true, titulo: true, descripcion: true },
          },
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
        },
      });

      const creditosReturn = await Promise.all(
        creditos.map(async credito => {
          const frecuencia = getFrecuencia(credito?.producto.frecuencia);
          const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
            credito?.producto.numeroDePagos as number,
            frecuencia,
            credito?.fechaInicio as string | Date,
            credito?.cuota,
            credito?.pagos as Pago[],
            credito?.cuotaMora
          );

          let status;
          if (amortizacion.some(table => table.status === StatusPago.adeuda)) {
            status = Status.MORA;
          } else if (
            amortizacion.filter(tabla => tabla.status === StatusPago.pagado).length === credito?.producto.numeroDePagos
          ) {
            status = Status.CERRADO;
          } else if (
            !amortizacion.some(tabla => tabla.status === StatusPago.adeuda) &&
            amortizacion.some(tabla => tabla.status === StatusPago.corriente)
          ) {
            status = Status.ABIERTO;
          }

          const saldoVencido = getSaldoVencido(amortizacion);

          const creditoReturn = {
            ...credito,
            amortizacion,
            status,
            saldoVencido,
          };

          if (status !== credito.status) {
            await this.prisma.credito.update({
              where: { id: credito.id },
              data: { status },
            });
          }

          return creditoReturn as ICreditoReturnDto;
        })
      );

      return creditosReturn.filter(credito => {
        if (statusCredito === 'ABIERTO' && (credito.status === 'ABIERTO' || credito.status === 'MORA')) {
          return credito;
        } else if (statusCredito === credito.status) {
          return credito;
        }
      });
    } catch (e: any) {
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error consultando los créditos del cliente',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async getCredito(id: string): Promise<ICreditoReturnDto | null> {
    try {
      const credito = await this.prisma.credito.findUnique({
        where: { id },
        include: {
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
                        select: {
                          id: true,
                          descripcion: true,
                          codigoPostal: true,
                        },
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
          modalidadDeSeguro: {
            select: { id: true, titulo: true, descripcion: true },
          },
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
        },
      });

      const frecuencia = getFrecuencia(credito?.producto.frecuencia);
      const amortizacion: IAmortizacion[] = generateTablaAmorizacion(
        credito?.producto.numeroDePagos as number,
        frecuencia,
        credito?.fechaInicio as string | Date,
        credito?.cuota as Prisma.Decimal,
        credito?.pagos as Pago[],
        credito?.cuotaMora as Prisma.Decimal
      );

      let status;
      if (amortizacion.some(table => table.status === StatusPago.adeuda)) {
        status = Status.MORA;
      } else if (
        amortizacion.filter(tabla => tabla.status === StatusPago.pagado).length === credito?.producto.numeroDePagos
      ) {
        status = Status.CERRADO;
      } else if (
        !amortizacion.some(tabla => tabla.status === StatusPago.adeuda) &&
        amortizacion.some(tabla => tabla.status === StatusPago.corriente)
      ) {
        status = Status.ABIERTO;
      }

      const saldoVencido = getSaldoVencido(amortizacion);
      const pagoNoIntereses = getPagoNoIntereses(amortizacion, credito?.cuota as Prisma.Decimal);

      const creditoReturn = {
        ...credito,
        amortizacion,
        status,
        saldoVencido,
        pagoNoIntereses,
      };

      if (status !== credito?.status) {
        await this.prisma.credito.update({
          where: { id: credito?.id },
          data: { status },
        });
      }

      return creditoReturn as ICreditoReturnDto;
    } catch (e: any) {
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error consultando créditos del cliente',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async getCreditosCount(id: string | null): Promise<number> {
    try {
      if (id === 'null') {
        id = null;
      }
      const creditosSum = id
        ? await this.prisma.credito.aggregate({
            where: { clienteId: { equals: id } },
            _count: true,
          })
        : await this.prisma.credito.aggregate({ _count: true });
      return creditosSum._count;
    } catch (e: any) {
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error contando los créditos',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async getOpenCreditosCount(clienteId: string, productId: string): Promise<number> {
    try {
      const creditosSum = await this.prisma.credito.aggregate({
        where: {
          AND: [
            { clienteId: { equals: clienteId } },
            { productosId: { equals: productId } },
            { status: { in: ['ABIERTO', 'SUSPENDIDO', 'MORA'] } },
          ],
        },
        _count: true,
      });
      if (creditosSum._count > 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_ACCEPTABLE,
            message: 'Error el cliente ya cuenta con un crédito sin cerrar para ese producto, Verificar',
          },
          HttpStatus.NOT_ACCEPTABLE
        );
      }
      return creditosSum._count;
    } catch (e: any) {
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error contando los créditos',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async createCredito(data: Prisma.CreditoCreateInput): Promise<ICreditoReturnDto> {
    let producto: Producto | null;
    try {
      const creditosActivos = await this.prisma.credito.findMany({
        where: {
          AND: [
            { clienteId: { equals: data.cliente.connect?.id } },
            { productosId: { equals: data.producto.connect?.id } },
            { fechaLiquidacion: { equals: null } },
          ],
        },
      });

      producto = await this.prisma.producto.findFirst({
        where: { id: { equals: data.producto.connect?.id } },
      });

      if (!producto) {
        throw new HttpException(
          {
            status: HttpStatus.PRECONDITION_FAILED,
            message: 'Error localizando el producto',
          },
          HttpStatus.PRECONDITION_FAILED
        );
      }

      if (creditosActivos.length > 0) {
        if (creditosActivos.length + 1 > Number(producto?.creditosActivos)) {
          throw new HttpException(
            {
              status: HttpStatus.PRECONDITION_FAILED,
              message: `Error el cliente solo puede tener ${producto?.creditosActivos} ${
                Number(producto?.creditosActivos) === 1 ? 'crédito activo' : 'créditos activos'
              }`,
            },
            HttpStatus.PRECONDITION_FAILED
          );
        }
      }

      const saldoInicialCaja: Partial<ICajaReturnDto> | null = await this.prisma.caja.findFirst({
        where: {
          AND: [{ sucursalId: { equals: data.sucursal.connect?.id } }, { fechaCierre: { equals: null } }],
        },
        select: {
          id: true,
          saldoInicial: true,
          movimientos: {
            select: { monto: true, tipo: true, observaciones: true },
          },
        },
      });

      if (!saldoInicialCaja) {
        throw new HttpException(
          {
            status: HttpStatus.PRECONDITION_FAILED,
            message: `Error no hay un turno abierto para otorgar el monto $${data.monto}, verificar. `,
          },
          HttpStatus.PRECONDITION_FAILED
        );
      }

      const saldo = getSaldoActual(saldoInicialCaja);

      if (saldo < Number(data.monto)) {
        throw new HttpException(
          {
            status: HttpStatus.PRECONDITION_FAILED,
            message: `Error no hay suficiente efectivo en sucursal para otorgar el monto $${data.monto}, verificar. `,
          },
          HttpStatus.PRECONDITION_FAILED
        );
      }

      const saldoInicial =
        (producto.interes.toNumber() / 100) * Number(data.monto) +
        Number(data.monto) +
        Number(producto.numeroDePagos) * Number(data.cuotaSeguro);
      const creditoCreado = await this.prisma.credito.create({
        data: { ...data, saldo: new Prisma.Decimal(saldoInicial) },
        include: {
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
                        select: {
                          id: true,
                          descripcion: true,
                          codigoPostal: true,
                        },
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
          modalidadDeSeguro: {
            select: { id: true, titulo: true, descripcion: true },
          },
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
        },
      });

      if (creditoCreado) {
        //once credito is created we retire the money from the sucursal
        const caja = await this.prisma.caja.findFirst({
          where: {
            AND: [{ sucursalId: { equals: data.sucursal?.connect?.id } }, { fechaCierre: { equals: null } }],
          },
          select: { id: true },
        });
        //preparing movimiento
        const movimiento: Prisma.MovimientoDeCajaCreateInput = {
          monto: creditoCreado.monto,
          tipo: 'RETIRO',
          categoria: Categoria.PRESTAMO,
          observaciones: `Préstamo otorgado a ${creditoCreado.cliente.nombre} ${creditoCreado.cliente.apellidoPaterno} ${creditoCreado.cliente.apellidoMaterno}`,
          creadoPor: data.creadoPor,
          caja: { connect: { id: caja?.id } },
        };
        //retiring the money.
        const retiro = await this.prisma.movimientoDeCaja.create({
          data: movimiento,
        });

        if (retiro) {
          return creditoCreado as ICreditoReturnDto;
        } else {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: `Error generando el retiro para el crédito ${creditoCreado.id}, verificar.`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error creando crédito, verificar.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (e: any) {
      console.log(e);
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error creando el nuevo crédito, verificar.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }
}
