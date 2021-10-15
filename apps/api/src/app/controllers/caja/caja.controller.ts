import { CreateCajaDto } from './../../dtos/create-caja.dto';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { CajaService } from './caja.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { Caja, Role } from '.prisma/client';

@Controller()
export class CajaController {
    constructor(private readonly cajaService: CajaService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('cajas')
    async getCajas(): Promise<Caja[]> {
        return this.cajaService.cajas();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('caja/:id')
    async getCaja(@Param('id') id: string): Promise<Caja> {
        return this.cajaService.caja({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Post('caja')
    async createCaja(@Body() data: CreateCajaDto): Promise<Caja> {
        return this.cajaService.createCaja(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Put('caja/:id')
    async editCaja(@Param('id') id: string, @Body() data: Caja): Promise<Caja> {
        return this.cajaService.updateCaja({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.DIRECTOR)
    @Delete('caja/:id')
    async deleteCaja(@Param('id') id: string): Promise<Caja> {
        return this.cajaService.deleteCaja({ id });
    }
}
