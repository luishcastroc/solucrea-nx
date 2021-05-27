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
import { EstadoCivil, Role } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { EstadosCivilesService } from './estados-civiles.service';

@Controller()
export class EstadosCivilesController {
    constructor(
        private readonly estadosCivilesService: EstadosCivilesService
    ) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('estados-civiles')
    async getEstadosCiviles(): Promise<EstadoCivil[]> {
        return this.estadosCivilesService.estadosCiviles();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('estados-civiles/:id')
    async getEstadoCivil(@Param('id') id: number): Promise<EstadoCivil> {
        return this.estadosCivilesService.estadoCivil({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('estados-civiles')
    async createEstadoCivil(
        @Body() estadoCivilData: EstadoCivil
    ): Promise<EstadoCivil> {
        return this.estadosCivilesService.createEstadoCivil(estadoCivilData);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('estados-civiles/:id')
    async editEstadoCivil(
        @Param('id') id: string,
        @Body() tiposDeViviendaData: EstadoCivil
    ): Promise<EstadoCivil> {
        return this.estadosCivilesService.updateEstadoCivil({
            where: { id: Number(id) },
            data: tiposDeViviendaData,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('estados-civiles/:id')
    async deleteEstadoCivil(@Param('id') id: string): Promise<EstadoCivil> {
        return this.estadosCivilesService.deleteEstadoCivil({ id: Number(id) });
    }
}
