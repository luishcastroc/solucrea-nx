import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FrecuenciaDePago, Prisma, Role } from '@prisma/client';

import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { FrecuenciasDePagoService } from './frecuencias-de-pago.service';

@Controller()
export class FrecuenciaDePagoController {
    constructor(private readonly frecuenciasDePagoService: FrecuenciasDePagoService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('frecuencias')
    async getFrecuenciasDePago(): Promise<Array<Partial<FrecuenciaDePago>>> {
        return this.frecuenciasDePagoService.frecuenciasDePago();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('frecuencia/:id')
    async getFrecuenciaDePago(@Param('id') id: string): Promise<Partial<FrecuenciaDePago>> {
        return this.frecuenciasDePagoService.frecuenciaDePago({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('frecuencia')
    async createFrecuenciaDePago(@Body() data: Prisma.FrecuenciaDePagoCreateInput): Promise<Partial<FrecuenciaDePago>> {
        return this.frecuenciasDePagoService.createFrecuenciaDePago(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('frecuencias/:id')
    async editFrecuenciaDePago(
        @Param('id') id: string,
        @Body() data: Prisma.FrecuenciaDePagoUpdateInput
    ): Promise<Partial<FrecuenciaDePago>> {
        return this.frecuenciasDePagoService.updateFrecuenciaDePago({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('frecuencia/:id')
    async deleteFrecuenciaDePago(@Param('id') id: string): Promise<Partial<FrecuenciaDePago>> {
        return this.frecuenciasDePagoService.deleteFrecuenciaDePago({ id });
    }
}
