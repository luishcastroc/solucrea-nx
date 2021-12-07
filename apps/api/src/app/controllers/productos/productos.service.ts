import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { Producto } from '.prisma/client';

@Injectable()
export class ProductosService {
    constructor(private prisma: PrismaService) {}

    // Productos

    async producto(where: Prisma.ProductoWhereUniqueInput): Promise<Producto | null> {
        return await this.prisma.producto.findUnique({
            where,
        });
    }

    async productos(): Promise<Producto[]> {
        return await this.prisma.producto.findMany({});
    }

    async createProducto(data: Prisma.ProductoCreateInput): Promise<Producto> {
        try {
            const newProducto = await this.prisma.producto.create({
                data,
            });

            return newProducto;
        } catch ({ response }) {
            if (response === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new HttpException(
                    { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creando el nuevo producto' },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException({ status: response.status, message: response.message }, response.status);
            }
        }
    }

    async updateProducto(params: {
        where: Prisma.ProductoWhereUniqueInput;
        data: Prisma.ProductoUpdateInput;
    }): Promise<Producto> {
        const { where, data } = params;
        return await this.prisma.producto.update({
            data,
            where,
        });
    }

    async deleteProducto(where: Prisma.ProductoWhereUniqueInput): Promise<Producto> {
        return this.prisma.producto.delete({
            where,
        });
    }
}
