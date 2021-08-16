import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ActividadEconomica, Prisma } from '@prisma/client';

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { CreateActividadEconomicaDto } from '../../dtos/create-actividad-economica.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { ActividadesEconomicasService } from './actividades-economicas.service';
import { Role } from '.prisma/client';

@Controller()
export class ActividadesEconomicasController {
    constructor(private readonly actividadesEconomicasService: ActividadesEconomicasService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('actividades-economicas')
    async getActividadesEconomicas(): Promise<ActividadEconomica[]> {
        return this.actividadesEconomicasService.actividadesEconomicas();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('actividad-economica/:id')
    async getActividadEconomica(@Param('id') id: string): Promise<ActividadEconomica> {
        return this.actividadesEconomicasService.actividadEconomica({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('actividad-economica')
    async createActividadEconomica(@Body() data: CreateActividadEconomicaDto): Promise<ActividadEconomica> {
        return this.actividadesEconomicasService.createActividadEconomica(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('actividad-economica/:id')
    async editActividadEconomica(
        @Param('id') id: string,
        @Body() data: Prisma.ActividadEconomicaUpdateInput
    ): Promise<ActividadEconomica> {
        return this.actividadesEconomicasService.updateActividadEconomica({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('actividad-economica/:id')
    async deleteActividadEconomica(@Param('id') id: string): Promise<ActividadEconomica> {
        return this.actividadesEconomicasService.deleteActividadEconomica({ id });
    }
}
