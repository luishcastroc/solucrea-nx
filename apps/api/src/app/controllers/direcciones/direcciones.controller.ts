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
import { Direccion, Prisma, Role } from '@prisma/client';

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { CreateDireccionDto } from '../../dtos/create-direccion.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { DireccionesService } from './direcciones.service';

@Controller()
export class DireccionesController {
    constructor(private readonly direccionesService: DireccionesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('direcciones')
    async getDirecciones(): Promise<Direccion[]> {
        return this.direccionesService.direcciones();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('direccion/:id')
    async getDireccion(@Param('id') id: string): Promise<Direccion> {
        return this.direccionesService.direccion({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('direccion')
    async createDireccion(
        @Body() data: CreateDireccionDto
    ): Promise<Direccion> {
        return this.direccionesService.createDireccion(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('direccion/:id')
    async editDireccion(
        @Param('id') id: string,
        @Body() data: Prisma.DireccionUpdateInput
    ): Promise<Direccion> {
        return this.direccionesService.updateDireccion({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('direccion/:id')
    async deleteDireccion(@Param('id') id: string): Promise<Direccion> {
        return this.direccionesService.deleteDireccion({ id });
    }
}
