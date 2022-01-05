import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Genero, Role } from '@prisma/client';

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { IGeneroReturnDto } from '../../dtos/genero-return.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateGeneroDto } from './../../dtos/create-genero.dto';
import { GenerosService } from './generos.service';

@Controller()
export class GenerosController {
    constructor(private readonly generosService: GenerosService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('generos')
    async getGeneros(): Promise<IGeneroReturnDto[]> {
        return this.generosService.generos();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('genero/:id')
    async getGenero(@Param('id') id: string): Promise<IGeneroReturnDto> {
        return this.generosService.genero({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('genero')
    async createGenero(@Body() data: CreateGeneroDto): Promise<IGeneroReturnDto> {
        return this.generosService.createGenero(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('generos/:id')
    async editGenero(@Param('id') id: string, @Body() data: Genero): Promise<IGeneroReturnDto> {
        return this.generosService.updateGenero({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('generos/:id')
    async deleteGenero(@Param('id') id: string): Promise<IGeneroReturnDto> {
        return this.generosService.deleteGenero({ id });
    }
}
