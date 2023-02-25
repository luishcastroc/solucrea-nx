import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MovimientoDeCaja, Prisma } from '@prisma/client';
import { PrismaService } from 'api/prisma';
import { DateTime } from 'luxon';

/* eslint-disable @typescript-eslint/naming-convention */
@Injectable()
export class MovimientosService {
  constructor(private prisma: PrismaService) {}

  async movimiento(
    MovimientoDeCajaWhereUniqueInput: Prisma.MovimientoDeCajaWhereUniqueInput
  ): Promise<MovimientoDeCaja | null> {
    const movimiento = await this.prisma.movimientoDeCaja.findUnique({
      where: MovimientoDeCajaWhereUniqueInput,
    });

    if (!movimiento) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: 'El movimiento no existe' },
        HttpStatus.NOT_FOUND
      );
    }

    return movimiento;
  }

  async movimientos(cajaId: string): Promise<MovimientoDeCaja[]> {
    try {
      const movimientos = await this.prisma.movimientoDeCaja.findMany({
        where: {
          cajaId: { equals: cajaId },
        },
      });

      return movimientos;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error consultando las cajas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createMovimiento(data: Prisma.MovimientoDeCajaCreateInput): Promise<MovimientoDeCaja> {
    const checkCaja = await this.prisma.caja.findFirst({
      where: {
        fechaCierre: { lte: DateTime.now().toISODate() },
        id: { equals: data.caja?.connect?.id },
      },
    });

    if (checkCaja) {
      throw new HttpException(
        {
          status: HttpStatus.FOUND,
          message: 'Error: no se pueden hacer movimientos en caja cerrada, Verificar.',
        },
        HttpStatus.FOUND
      );
    }

    try {
      const movimiento = await this.prisma.movimientoDeCaja.create({ data });
      return movimiento;
    } catch (e: any) {
      if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error creando el turno',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async updateMovimiento(params: {
    where: Prisma.MovimientoDeCajaWhereUniqueInput;
    data: Prisma.MovimientoDeCajaUpdateInput;
  }): Promise<MovimientoDeCaja> {
    const { where, data } = params;

    try {
      const movimientoUpdate = await this.prisma.movimientoDeCaja.update({
        data,
        where,
      });
      return movimientoUpdate;
    } catch (e: any) {
      if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error actualizando el movimiento',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async deleteMovimiento(where: Prisma.MovimientoDeCajaWhereUniqueInput): Promise<MovimientoDeCaja> {
    try {
      const movimiento = await this.prisma.movimientoDeCaja.delete({
        where,
      });
      return movimiento;
    } catch (e: any) {
      if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error borrando el movimiento',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }

  async getMovimientosCount(cajaId: string): Promise<number> {
    try {
      const movimientosSum = await this.prisma.movimientoDeCaja.aggregate({
        _count: true,
        where: { cajaId: { equals: cajaId } },
      });
      return movimientosSum._count;
    } catch (e: any) {
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error contando los movimientos',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException({ status: e.response.status, message: e.response.message }, e.response.status);
      }
    }
  }
}
