import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Escolaridad, Role } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from '../../decorators/public.decorator';
import { EscolaridadesService } from './escolaridades.service';

@Controller()
export class EscolaridadesController {
    constructor(private readonly escolaridadesService: EscolaridadesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('escolaridades')
    async getEscolaridades(): Promise<Escolaridad[]> {
        return this.escolaridadesService.escolaridades();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('escolaridad/:id')
    async getEscolaridad(@Param('id') id: string): Promise<Escolaridad> {
        return this.escolaridadesService.escolaridad({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('escolaridad')
    async createEscolaridad(@Body() data: Escolaridad): Promise<Escolaridad> {
        return this.escolaridadesService.createEscolaridad(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('escolaridad/:id')
    async editEscolaridad(
        @Param('id') id: string,
        @Body() data: Escolaridad
    ): Promise<Escolaridad> {
        return this.escolaridadesService.updateEscolaridad({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('escolaridad/:id')
    async deleteEscolaridad(@Param('id') id: string): Promise<Escolaridad> {
        return this.escolaridadesService.deleteEscolaridad({ id });
    }
}
