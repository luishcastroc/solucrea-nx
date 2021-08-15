import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Role, TipoDeVivienda } from '@prisma/client';

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { ITipoDeViviendaReturnDto } from './../../dtos/tipo-de-vivienda-return.dto';
import { TiposViviendaService } from './tipos-vivienda.service';

@Controller()
export class TiposViviendaController {
    constructor(private readonly tiposViviendaService: TiposViviendaService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('tipos-de-vivienda')
    async getTiposDeVivienda(): Promise<ITipoDeViviendaReturnDto[]> {
        return this.tiposViviendaService.tiposDeVivienda();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('tipo-de-vivienda/:id')
    async getTipoDeVivienda(@Param('id') id: string): Promise<ITipoDeViviendaReturnDto> {
        return this.tiposViviendaService.tipoDeVivienda({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('tipo-de-vivienda')
    async createTipoDeVivienda(@Body() data: TipoDeVivienda): Promise<ITipoDeViviendaReturnDto> {
        return this.tiposViviendaService.createTipoDeVivienda(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('tipo-de-vivienda/:id')
    async editTipoDeVivienda(@Param('id') id: string, @Body() data: TipoDeVivienda): Promise<ITipoDeViviendaReturnDto> {
        return this.tiposViviendaService.updateTipoDeVivienda({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('tipo-de-vivienda/:id')
    async deleteTipoDeVivienda(@Param('id') id: string): Promise<ITipoDeViviendaReturnDto> {
        return this.tiposViviendaService.deleteTipoDeVivienda({
            id,
        });
    }
}
