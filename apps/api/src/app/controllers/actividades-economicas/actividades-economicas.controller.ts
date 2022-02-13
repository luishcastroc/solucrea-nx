import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActividadesEconomicasService } from './actividades-economicas.service';
import { Public, Roles } from 'api/decorators';
import { CreateActividadEconomicaDto, IActividadEconomicaReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

import { Role } from '.prisma/client';

@Controller()
export class ActividadesEconomicasController {
    constructor(private readonly actividadesEconomicasService: ActividadesEconomicasService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('actividades-economicas')
    async getActividadesEconomicas(): Promise<IActividadEconomicaReturnDto[]> {
        return this.actividadesEconomicasService.actividadesEconomicas();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('actividad-economica/:id')
    async getActividadEconomica(@Param('id') id: string): Promise<IActividadEconomicaReturnDto | null> {
        return this.actividadesEconomicasService.actividadEconomica({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('actividad-economica')
    async createActividadEconomica(@Body() data: CreateActividadEconomicaDto): Promise<IActividadEconomicaReturnDto> {
        return this.actividadesEconomicasService.createActividadEconomica(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('actividad-economica/:id')
    async editActividadEconomica(
        @Param('id') id: string,
        @Body() data: Prisma.ActividadEconomicaUpdateInput
    ): Promise<IActividadEconomicaReturnDto> {
        return this.actividadesEconomicasService.updateActividadEconomica({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('actividad-economica/:id')
    async deleteActividadEconomica(@Param('id') id: string): Promise<IActividadEconomicaReturnDto> {
        return this.actividadesEconomicasService.deleteActividadEconomica({ id });
    }
}
