import { Public } from './../../decorators/public.decorator';
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

import { Roles } from '../../decorators/roles.decorator';
import { CreateFraccionamientoDto } from '../../dtos/create-fraccionamiento.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { FraccionamientosService } from './fraccionamientos.service';
import { Fraccionamiento, Role } from '.prisma/client';

@Controller('fraccionamientos')
export class FraccionamientosController {
    constructor(
        private readonly fraccionamientosService: FraccionamientosService
    ) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('fraccionamientos')
    async getFraccionamientos(): Promise<Fraccionamiento[]> {
        return this.fraccionamientosService.fraccionamientos();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('fraccionamiento/:id')
    async getFraccionamiento(
        @Param('id') id: string
    ): Promise<Fraccionamiento> {
        return this.fraccionamientosService.fraccionamiento({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('fraccionamiento')
    async createFraccionamiento(
        @Body() data: CreateFraccionamientoDto
    ): Promise<Fraccionamiento> {
        return this.fraccionamientosService.createFraccionamiento(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('fraccionamiento/:id')
    async editFraccionamiento(
        @Param('id') id: string,
        @Body() data: Fraccionamiento
    ): Promise<Fraccionamiento> {
        return this.fraccionamientosService.updateFraccionamiento({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('fraccionamiento/:id')
    async deleteFraccionamiento(
        @Param('id') id: string
    ): Promise<Fraccionamiento> {
        return this.fraccionamientosService.deleteFraccionamiento({ id });
    }
}
