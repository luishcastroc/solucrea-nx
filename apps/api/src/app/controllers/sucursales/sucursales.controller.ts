import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { Prisma, Role, Sucursal as SucursalModel } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { SucursalesService } from './sucursales.service';

@Controller()
export class SucursalesController {
    constructor(private readonly sucursalesService: SucursalesService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @Get('sucursales')
    async obtenerSucursales(): Promise<SucursalModel[]> {
        return this.sucursalesService.sucursales();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @Get('sucursal/:id')
    async obtenerSucursal(@Param('id') id: number): Promise<SucursalModel> {
        return this.sucursalesService.sucursal({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('sucursal')
    async createSucursal(
        @Body() data: Prisma.SucursalCreateInput
    ): Promise<SucursalModel> {
        return this.sucursalesService.createSucursal(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('sucursal/:id')
    async editSucursal(
        @Param('id') id: string,
        @Body() data: Prisma.SucursalUpdateInput
    ): Promise<SucursalModel> {
        return this.sucursalesService.updateSucursal({
            where: { id: Number(id) },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('sucursal/:id')
    async deleteSucursal(@Param('id') id: string): Promise<SucursalModel> {
        return this.sucursalesService.deleteSucursal({ id: Number(id) });
    }
}
