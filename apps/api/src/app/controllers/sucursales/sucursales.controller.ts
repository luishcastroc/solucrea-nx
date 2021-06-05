import { CreateSucursalDto } from './../../dtos/create-sucursal.dto';
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
import { Public } from '../../decorators/public.decorator';

@Controller()
export class SucursalesController {
    constructor(private readonly sucursalesService: SucursalesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('sucursales')
    async obtenerSucursales(): Promise<SucursalModel[]> {
        return this.sucursalesService.sucursales();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('sucursal/:id')
    async obtenerSucursal(@Param('id') id: string): Promise<SucursalModel> {
        return this.sucursalesService.sucursal({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('sucursal')
    async createSucursal(
        @Body() data: CreateSucursalDto
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
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('sucursal/:id')
    async deleteSucursal(@Param('id') id: string): Promise<SucursalModel> {
        return this.sucursalesService.deleteSucursal({ id });
    }
}
