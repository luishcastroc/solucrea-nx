import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { CreditosService } from './creditos.service';
import { Roles } from 'api/decorators';
import { ICreditoReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class CreditosController {
    constructor(private readonly creditosService: CreditosService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos/cliente/:id')
    async obtenerCreditosCliente(@Param('id') id: string): Promise<ICreditoReturnDto[]> {
        return this.creditosService.creditosCliente(id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos')
    async obtenerCreditos(): Promise<ICreditoReturnDto[]> {
        return this.creditosService.creditos();
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Post('credito')
    async createCredito(@Request() req, @Body() data: Prisma.CreditoCreateInput): Promise<ICreditoReturnDto> {
        const creadoPor = req.user.username.toUpperCase();
        data.creadoPor = creadoPor;
        data.status = 'ABIERTO';
        data.aval.create.creadoPor = creadoPor;
        console.log(data);
        return this.creditosService.createCredito(data);
    }
}
