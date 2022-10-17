import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Producto } from '@prisma/client';
import { PrismaService } from 'api/prisma';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  // Productos

  async producto(
    where: Prisma.ProductoWhereUniqueInput
  ): Promise<Producto | null> {
    try {
      const producto = await this.prisma.producto.findUnique({
        where,
      });
      return producto;
    } catch (e: any) {
      if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error obteniendo el credito',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          { status: e.response.status, message: e.response.message },
          e.response.status
        );
      }
    }
  }

  async productos(): Promise<Producto[]> {
    try {
      const productos = await this.prisma.producto.findMany({});

      return productos;
    } catch (e: any) {
      if (e?.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error obteniendo los creditos',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          { status: e?.response.status, message: e?.response.message },
          e?.response.status
        );
      }
    }
  }

  async createProducto(data: Prisma.ProductoCreateInput): Promise<Producto> {
    const { id, creditosActivos, ...rest } = data;
    const producto = { ...rest, creditosActivos: Number(creditosActivos) };
    try {
      const newProducto = await this.prisma.producto.create({
        data: producto,
      });

      return newProducto;
    } catch (e: any) {
      console.log(e);
      if (e?.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error creando el nuevo producto',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          { status: e.response?.status, message: e.response?.message },
          e.response?.status
        );
      }
    }
  }

  async updateProducto(params: {
    where: Prisma.ProductoWhereUniqueInput;
    data: Prisma.ProductoUpdateInput;
  }): Promise<Producto> {
    const { where, data } = params;

    try {
      const producto = await this.prisma.producto.update({
        data,
        where,
      });

      return producto;
    } catch (e: any) {
      console.log(e);
      if (e.response && e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error actualizando el credito',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          { status: e.response.status, message: e.response.message },
          e.response.status
        );
      }
    }
  }

  async deleteProducto(
    where: Prisma.ProductoWhereUniqueInput
  ): Promise<Producto> {
    try {
      const innactiveCredito = await this.prisma.producto.update({
        where,
        data: { activo: false },
      });

      return innactiveCredito;
    } catch (e: any) {
      if (e.response === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error desactivando el credito',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          { status: e.response.status, message: e.response.message },
          e.response.status
        );
      }
    }
  }
}
