import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { EstadoService } from './estado.service';
import { Estado, Role } from '.prisma/client';

@Controller()
export class EstadoController {
    constructor(private readonly estadoService: EstadoService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('estados')
    async getEstados(): Promise<Estado[]> {
        return this.estadoService.estados();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('estado/:id')
    async getEstado(@Param('id') id: number): Promise<Estado> {
        return this.estadoService.estado({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('estado')
    async createEstado(@Body() estadoData: Estado): Promise<Estado> {
        return this.estadoService.createEstado(estadoData);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('estado/:id')
    async editEstado(@Param('id') id: number, @Body() tiposDeViviendaData: Estado): Promise<Estado> {
        return this.estadoService.updateEstado({
            where: { id },
            data: tiposDeViviendaData,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('estado/:id')
    async deleteEstado(@Param('id') id: number): Promise<Estado> {
        return this.estadoService.deleteEstado({ id });
    }
}
