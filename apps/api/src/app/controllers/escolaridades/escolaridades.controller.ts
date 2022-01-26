import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Escolaridad, Role } from '@prisma/client';
import { EscolaridadesService } from './escolaridades.service';
import { Public, Roles } from 'api/decorators';
import { IEscolaridadReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class EscolaridadesController {
    constructor(private readonly escolaridadesService: EscolaridadesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('escolaridades')
    async getEscolaridades(): Promise<IEscolaridadReturnDto[]> {
        return this.escolaridadesService.escolaridades();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('escolaridad/:id')
    async getEscolaridad(@Param('id') id: string): Promise<IEscolaridadReturnDto> {
        return this.escolaridadesService.escolaridad({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('escolaridad')
    async createEscolaridad(@Body() data: Escolaridad): Promise<IEscolaridadReturnDto> {
        return this.escolaridadesService.createEscolaridad(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('escolaridad/:id')
    async editEscolaridad(@Param('id') id: string, @Body() data: Escolaridad): Promise<IEscolaridadReturnDto> {
        return this.escolaridadesService.updateEscolaridad({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('escolaridad/:id')
    async deleteEscolaridad(@Param('id') id: string): Promise<IEscolaridadReturnDto> {
        return this.escolaridadesService.deleteEscolaridad({ id });
    }
}
