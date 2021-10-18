import { ICajaReturnDto } from 'api/dtos';
import { CreateCajaDto } from './../../dtos/create-caja.dto';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { CajaService } from './caja.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { Caja, Role } from '.prisma/client';

@Controller()
export class CajaController {
    constructor(private readonly cajaService: CajaService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('cajas')
    async getCajas(): Promise<ICajaReturnDto[]> {
        return this.cajaService.cajas();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('caja/:id')
    async getCaja(@Param('id') id: string): Promise<ICajaReturnDto> {
        return this.cajaService.caja({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Post('caja')
    async createCaja(@Request() req, @Body() data: CreateCajaDto): Promise<ICajaReturnDto> {
        const creadoPor = req.user.username;
        data.creadoPor = creadoPor;
        return this.cajaService.createCaja(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Put('caja/:id')
    async editCaja(@Param('id') id: string, @Body() data: Caja): Promise<ICajaReturnDto> {
        return this.cajaService.updateCaja({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.DIRECTOR)
    @Delete('caja/:id')
    async deleteCaja(@Param('id') id: string): Promise<ICajaReturnDto> {
        return this.cajaService.deleteCaja({ id });
    }
}
