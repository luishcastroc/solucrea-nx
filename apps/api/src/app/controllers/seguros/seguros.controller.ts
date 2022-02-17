import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Genero, Role } from '@prisma/client';
import { SegurosService } from './seguros.service';
import { Public, Roles } from 'api/decorators';
import { CreateSeguroDto, IModalidadSeguroReturnDto, ISeguroReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class SegurosController {
    constructor(private readonly segurosService: SegurosService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('seguros')
    async getSeguros(): Promise<ISeguroReturnDto[]> {
        return this.segurosService.seguros();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('seguro/:id')
    async getSeguro(@Param('id') id: string): Promise<ISeguroReturnDto | null> {
        return this.segurosService.seguro({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('seguro')
    async createSeguro(@Body() data: CreateSeguroDto): Promise<ISeguroReturnDto> {
        return this.segurosService.createSeguro(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('seguro/:id')
    async editSeguro(@Param('id') id: string, @Body() data: Genero): Promise<ISeguroReturnDto> {
        return this.segurosService.updateSeguro({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('seguro/:id')
    async deleteSeguro(@Param('id') id: string): Promise<ISeguroReturnDto> {
        return this.segurosService.deleteSeguro({ id });
    }

    //Modalidades

    @UseGuards(RolesGuard)
    @Public()
    @Get('seguros/modalidades')
    async getModalidades(): Promise<IModalidadSeguroReturnDto[]> {
        return this.segurosService.modalidades();
    }
}
