import { Injectable } from '@nestjs/common';
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
        return await this.prisma.producto.create({
            data,
        });
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
