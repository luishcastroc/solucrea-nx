import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ColoniasService } from './colonias.service';
import { Public, Roles } from 'api/decorators';
import { CreateColoniaDto, IColoniaReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';
import { Colonia, Role } from '@prisma/client';

@Controller()
export class ColoniasController {
    constructor(private readonly coloniasService: ColoniasService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('colonias')
    async getColonias(): Promise<Colonia[]> {
        return this.coloniasService.colonias();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('colonia/:id')
    async getColonia(@Param('id') id: string): Promise<Colonia | null> {
        return this.coloniasService.colonia({ id });
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('colonias/cp/:cp')
    async getColoniasByCp(@Param('cp') cp: string): Promise<IColoniaReturnDto> {
        return this.coloniasService.coloniasByCp({ codigoPostal: cp });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('colonias')
    async createcolonias(@Body() data: CreateColoniaDto): Promise<Colonia> {
        return this.coloniasService.createColonia(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('colonias/:id')
    async editcolonias(@Param('id') id: string, @Body() data: Colonia): Promise<Colonia> {
        return this.coloniasService.updateColonia({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('colonias/:id')
    async deletecolonias(@Param('id') id: string): Promise<Colonia> {
        return this.coloniasService.deleteColonia({ id });
    }
}
