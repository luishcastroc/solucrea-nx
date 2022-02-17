import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EstadoCivil, Role } from '@prisma/client';
import { EstadosCivilesService } from './estados-civiles.service';
import { Public, Roles } from 'api/decorators';
import { CreateEstadoCivilDto, IEstadoCivilReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class EstadosCivilesController {
    constructor(private readonly estadosCivilesService: EstadosCivilesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('estados-civiles')
    async getEstadosCiviles(): Promise<IEstadoCivilReturnDto[]> {
        return this.estadosCivilesService.estadosCiviles();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('estado-civil/:id')
    async getEstadoCivil(@Param('id') id: string): Promise<IEstadoCivilReturnDto | null> {
        return this.estadosCivilesService.estadoCivil({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('estado-civil')
    async createEstadoCivil(@Body() data: CreateEstadoCivilDto): Promise<IEstadoCivilReturnDto> {
        return this.estadosCivilesService.createEstadoCivil(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('estado-civil/:id')
    async editEstadoCivil(@Param('id') id: string, @Body() data: EstadoCivil): Promise<IEstadoCivilReturnDto> {
        return this.estadosCivilesService.updateEstadoCivil({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('estado-civil/:id')
    async deleteEstadoCivil(@Param('id') id: string): Promise<IEstadoCivilReturnDto> {
        return this.estadosCivilesService.deleteEstadoCivil({ id });
    }
}
