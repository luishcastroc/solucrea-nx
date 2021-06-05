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
    @Get('genero/:id')
    async getGenero(@Param('id') id: string): Promise<Genero> {
        return this.generosService.genero({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('generos')
    async createGenero(@Body() data: Genero): Promise<Genero> {
        return this.generosService.createGenero(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('generos/:id')
    async editGenero(
        @Param('id') id: string,
        @Body() data: Genero
    ): Promise<Genero> {
        return this.generosService.updateGenero({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('generos/:id')
    async deleteGenero(@Param('id') id: string): Promise<Genero> {
        return this.generosService.deleteGenero({ id });
    }
}
