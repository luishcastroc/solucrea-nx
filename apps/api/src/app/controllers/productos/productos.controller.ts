import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProductosService } from './productos.service';
import { Public, Roles } from 'api/decorators';
import { CreateProductoDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

import { Prisma, Producto } from '.prisma/client';

@Controller()
export class ProductosController {
    constructor(private readonly productosService: ProductosService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('productos')
    async getProductos(): Promise<Producto[]> {
        return this.productosService.productos();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('producto/:id')
    async getProducto(@Param('id') id: string): Promise<Producto | null> {
        return this.productosService.producto({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('producto')
    async createProducto(@Body() data: CreateProductoDto): Promise<Producto> {
        return this.productosService.createProducto(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('producto/:id')
    async editProducto(@Param('id') id: string, @Body() data: Prisma.ProductoUpdateInput): Promise<Producto> {
        return this.productosService.updateProducto({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('producto/:id')
    async deleteProducto(@Param('id') id: string): Promise<Producto> {
        return this.productosService.deleteProducto({ id });
    }
}
