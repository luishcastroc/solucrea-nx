import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { SucursalesService } from './sucursales.service';
import { Public, Roles } from 'api/decorators';
import { CreateSucursalDto, ISucursalReturnDto, UpdateSucursalDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class SucursalesController {
    constructor(private readonly sucursalesService: SucursalesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('sucursales')
    async obtenerSucursales(): Promise<ISucursalReturnDto[]> {
        return this.sucursalesService.sucursales();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('sucursal/:id')
    async obtenerSucursal(@Param('id') id: string): Promise<ISucursalReturnDto | null> {
        return this.sucursalesService.sucursal({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('sucursal')
    async createSucursal(@Request() req: any, @Body() data: CreateSucursalDto): Promise<ISucursalReturnDto> {
        const creadoPor = req.user.username;
        data.creadoPor = creadoPor;
        return this.sucursalesService.createSucursal(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('sucursal/:id')
    async editSucursal(@Param('id') id: string, @Body() data: UpdateSucursalDto): Promise<ISucursalReturnDto> {
        return this.sucursalesService.updateSucursal({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('sucursal/:id')
    async deleteSucursal(@Param('id') id: string): Promise<ISucursalReturnDto> {
        return this.sucursalesService.deleteSucursal({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ALL)
    @Post('sucursales/caja')
    async getSucursalesWithCaja(
        @Body() data: { minAmount: number; maxAmount: number }
    ): Promise<Partial<ISucursalReturnDto>[]> {
        const { minAmount, maxAmount } = data;
        return this.sucursalesService.getSucursalesWithCaja(minAmount, maxAmount);
    }
}
