import { Public } from './../../decorators/public.decorator';
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
    @Public()
    @Get('estados-civiles')
    async getEstadosCiviles(): Promise<EstadoCivil[]> {
        return this.estadosCivilesService.estadosCiviles();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('estados-civiles/:id')
    async getEstadoCivil(@Param('id') id: string): Promise<EstadoCivil> {
        return this.estadosCivilesService.estadoCivil({ id });
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
        @Body() data: EstadoCivil
    ): Promise<EstadoCivil> {
        return this.estadosCivilesService.updateEstadoCivil({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('estados-civiles/:id')
    async deleteEstadoCivil(@Param('id') id: string): Promise<EstadoCivil> {
        return this.estadosCivilesService.deleteEstadoCivil({ id });
    }
}
