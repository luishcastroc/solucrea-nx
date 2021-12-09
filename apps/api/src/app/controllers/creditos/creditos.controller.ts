import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ICreditoReturnDto } from 'api/dtos';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { CreditosService } from './creditos.service';

@Controller()
export class CreditosController {
    constructor(private readonly creditosService: CreditosService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos/cliente/:id')
    async obtenerCreditosCliente(@Param('id') id: string): Promise<ICreditoReturnDto[]> {
        return this.creditosService.creditosCliente({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos')
    async obtenerCreditos(): Promise<ICreditoReturnDto[]> {
        return this.creditosService.creditos();
    }
}
