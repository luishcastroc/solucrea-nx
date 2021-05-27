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
import { Role, TipoDeVivieda } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { TiposViviendaService } from './tipos-vivienda.service';

@Controller()
export class TiposViviendaController {
    constructor(private readonly tiposViviendaService: TiposViviendaService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('tipos-de-vivienda')
    async getTiposDeVivienda(): Promise<TipoDeVivieda[]> {
        return this.tiposViviendaService.tiposDeVivienda();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('tipos-de-vivienda/:id')
    async getTipoDeVivienda(@Param('id') id: number): Promise<TipoDeVivieda> {
        return this.tiposViviendaService.tipoDeVivienda({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('tipos-de-vivienda')
    async createTipoDeVivienda(
        @Body() tipoDeViviendaData: TipoDeVivieda
    ): Promise<TipoDeVivieda> {
        return this.tiposViviendaService.createTipoDeVivienda(
            tipoDeViviendaData
        );
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('tipos-de-vivienda/:id')
    async editTipoDeVivienda(
        @Param('id') id: string,
        @Body() tiposDeViviendaData: TipoDeVivieda
    ): Promise<TipoDeVivieda> {
        return this.tiposViviendaService.updateTipoDeVivienda({
            where: { id: Number(id) },
            data: tiposDeViviendaData,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('tipos-de-vivienda/:id')
    async deleteTipoDeVivienda(
        @Param('id') id: string
    ): Promise<TipoDeVivieda> {
        return this.tiposViviendaService.deleteTipoDeVivienda({
            id: Number(id),
        });
    }
}
