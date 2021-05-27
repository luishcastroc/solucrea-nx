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
import { Escolaridad, Role } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { EscolaridadesService } from './escolaridades.service';

@Controller()
export class EscolaridadesController {
    constructor(private readonly escolaridadesService: EscolaridadesService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('escolaridades')
    async getEscolaridades(): Promise<Escolaridad[]> {
        return this.escolaridadesService.escolaridades();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('escolaridades/:id')
    async getEscolaridad(@Param('id') id: number): Promise<Escolaridad> {
        return this.escolaridadesService.escolaridad({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('escolaridades')
    async createEscolaridad(
        @Body() escolaridadData: Escolaridad
    ): Promise<Escolaridad> {
        return this.escolaridadesService.createEscolaridad(escolaridadData);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('escolaridades/:id')
    async editEscolaridad(
        @Param('id') id: string,
        @Body() tiposDeViviendaData: Escolaridad
    ): Promise<Escolaridad> {
        return this.escolaridadesService.updateEscolaridad({
            where: { id: Number(id) },
            data: tiposDeViviendaData,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('escolaridades/:id')
    async deleteEscolaridad(@Param('id') id: string): Promise<Escolaridad> {
        return this.escolaridadesService.deleteEscolaridad({ id: Number(id) });
    }
}
