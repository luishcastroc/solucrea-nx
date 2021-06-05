import { Public } from './../../decorators/public.decorator';
import { RolesGuard } from './../../guards/roles.guard';
import { Roles } from './../../decorators/roles.decorator';
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
import { Estado, Role } from '.prisma/client';
import { EstadoService } from './estado.service';

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
    async getEstado(@Param('id') id: string): Promise<Estado> {
        return this.estadoService.estado({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('estado')
    async createEstado(@Body() estadoData: Estado): Promise<Estado> {
        return this.estadoService.createEstado(estadoData);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('estado/:id')
    async editEstado(
        @Param('id') id: string,
        @Body() tiposDeViviendaData: Estado
    ): Promise<Estado> {
        return this.estadoService.updateEstado({
            where: { id },
            data: tiposDeViviendaData,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('estado/:id')
    async deleteEstado(@Param('id') id: string): Promise<Estado> {
        return this.estadoService.deleteEstado({ id });
    }
}
