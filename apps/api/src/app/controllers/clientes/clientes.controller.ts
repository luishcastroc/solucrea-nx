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
import { Cliente, Prisma, Role } from '@prisma/client';

import { CreateClienteDto } from '../../dtos/create-cliente.dto';
import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { ClientesService } from './clientes.service';
import { IClienteReturnDto, UpdateClienteDto } from 'api/dtos';

@Controller('')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('clientes')
    async getClientes(): Promise<IClienteReturnDto[]> {
        return this.clientesService.clientes();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('cliente/:id')
    async getCliente(@Param('id') id: string): Promise<IClienteReturnDto> {
        return this.clientesService.cliente({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('cliente')
    async createCliente(@Request() req, @Body() data: CreateClienteDto): Promise<Cliente> {
        const creadoPor = req.user.username;
        data.creadoPor = creadoPor;
        return this.clientesService.createCliente(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('cliente/:id')
    async editCliente(
        @Request() req,
        @Param('id') id: string,
        @Body() data: UpdateClienteDto
    ): Promise<IClienteReturnDto> {
        const actualizadoPor = req.user.username;
        data.actualizadoPor = actualizadoPor;
        return this.clientesService.updateCliente({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('cliente/:id')
    async deleteCliente(@Param('id') id: string): Promise<Cliente> {
        return this.clientesService.deleteCliente({ id });
    }
}
