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
import { Cliente, Prisma, Role } from '@prisma/client';

import { CreateClienteDto } from '../../dtos/create-cliente.dto';
import { Roles } from './../../decorators/roles.decorator';
import { RolesGuard } from './../../guards/roles.guard';
import { ClientesService } from './clientes.service';

@Controller('')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('clientes')
    async getClientes(): Promise<Cliente[]> {
        return this.clientesService.clientes();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('clientes/:id')
    async getTipoDeVivienda(@Param('id') id: string): Promise<Cliente> {
        return this.clientesService.cliente({ id });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('clientes')
    async createTipoDeVivienda(
        @Body() data: CreateClienteDto
    ): Promise<Cliente> {
        return this.clientesService.createClientes(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('clientes/:id')
    async editTipoDeVivienda(
        @Param('id') id: string,
        @Body() data: Prisma.ClienteUpdateInput
    ): Promise<Cliente> {
        return this.clientesService.updateClientes({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('clientes/:id')
    async deleteTipoDeVivienda(@Param('id') id: string): Promise<Cliente> {
        return this.clientesService.deleteClientes({ id });
    }
}
