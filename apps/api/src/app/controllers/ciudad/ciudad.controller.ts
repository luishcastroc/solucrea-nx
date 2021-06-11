import { CreateCiudadDto } from './../../dtos/create-ciudad.dto';
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

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';

import { RolesGuard } from '../../guards/roles.guard';
import { CiudadService } from './ciudad.service';
import { Ciudad, Role } from '.prisma/client';

@Controller()
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('ciudades')
    async getCiudades(): Promise<Ciudad[]> {
        return this.ciudadService.ciudades();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('ciudad/:id')
    async getCiudad(@Param('id') id: string): Promise<Ciudad> {
        return this.ciudadService.ciudad({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('ciudad')
    async createCiudad(@Body() data: CreateCiudadDto): Promise<Ciudad> {
        return this.ciudadService.createCiudad(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('ciudad/:id')
    async editCiudad(
        @Param('id') id: string,
        @Body() data: Ciudad
    ): Promise<Ciudad> {
        return this.ciudadService.updateCiudad({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('ciudad/:id')
    async deleteCiudad(@Param('id') id: string): Promise<Ciudad> {
        return this.ciudadService.deleteCiudad({ id });
    }
}