import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Prisma, Role, Status } from '@prisma/client';
import { CreditosService } from './creditos.service';
import { Roles } from 'api/decorators';
import { ICreditoReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class CreditosController {
    constructor(private readonly creditosService: CreditosService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos/cliente/:id/:status')
    async obtenerCreditosCliente(
        @Param('id') id: string,
        @Param('status') status: Status
    ): Promise<ICreditoReturnDto[] | null> {
        return this.creditosService.creditosCliente(id, status);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos/:status')
    async obtenerCreditos(@Param('status') status: Status): Promise<ICreditoReturnDto[] | null> {
        return this.creditosService.creditos(status);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('credito/:id')
    async obtenerCredito(@Param('id') id: string): Promise<ICreditoReturnDto | null> {
        return this.creditosService.getCredito(id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Get('creditos-count/:id')
    async creditosCount(@Param('id') id: string | null): Promise<number> {
        return this.creditosService.getCreditosCount(id);
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
    @Post('credito')
    async createCredito(@Request() req: any, @Body() data: Prisma.CreditoCreateInput): Promise<ICreditoReturnDto> {
        const creadoPor = req.user.username.toUpperCase();
        data.creadoPor = creadoPor;
        data.status = 'ABIERTO';
        if (data.aval && data.aval.create) {
            data.aval.create.creadoPor = creadoPor;
        }
        return this.creditosService.createCredito(data);
    }
}
