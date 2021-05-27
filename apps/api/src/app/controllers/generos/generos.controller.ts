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
import { Genero, Role } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { GenerosService } from './generos.service';

@Controller()
export class GenerosController {
    constructor(private readonly generosService: GenerosService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('generos')
    async getGeneros(): Promise<Genero[]> {
        return this.generosService.generos();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('generos/:id')
    async getGenero(@Param('id') id: number): Promise<Genero> {
        return this.generosService.genero({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('generos')
    async createGenero(@Body() generosData: Genero): Promise<Genero> {
        return this.generosService.createGenero(generosData);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('generos/:id')
    async editGenero(
        @Param('id') id: string,
        @Body() tiposDeViviendaData: Genero
    ): Promise<Genero> {
        return this.generosService.updateGenero({
            where: { id: Number(id) },
            data: tiposDeViviendaData,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('generos/:id')
    async deleteGenero(@Param('id') id: string): Promise<Genero> {
        return this.generosService.deleteGenero({ id: Number(id) });
    }
}
