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
import { Cliente, Role } from '@prisma/client';

import { Roles } from './../../decorators/roles.decorator';
import { RolesGuard } from './../../guards/roles.guard';
import { ClientesService } from './clientes.service';

@Controller('')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('clientes')
    async getClientes(): Promise<Cliente[]> {
        return this.clientesService.clientes();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('clientes/:id')
    async getTipoDeVivienda(@Param('id') id: number): Promise<Cliente> {
        return this.clientesService.cliente({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('clientes')
    async createTipoDeVivienda(
        @Body() clientesData: Cliente
    ): Promise<Cliente> {
        const {
            nombre,
            apellidos,
            fechaDeNacimiento,
            rfc,
            curp,
            telefono1,
            telefono2,
            montoMinimo,
            montoMaximo,
            numeroCreditosCrecer,
            estadoCivilId,
            tipoDeViviedaId,
            escolaridadId,
            generoId,
            creadoPor,
        } = clientesData;
        return this.clientesService.createClientes({
            nombre,
            apellidos,
            fechaDeNacimiento,
            rfc,
            curp,
            telefono1,
            telefono2,
            montoMinimo,
            montoMaximo,
            numeroCreditosCrecer,
            estadoCivil: { connect: { id: estadoCivilId } },
            tipoDeVivienda: { connect: { id: tipoDeViviedaId } },
            escolaridad: { connect: { id: escolaridadId } },
            genero: { connect: { id: generoId } },
            creadoPor,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('clientes/:id')
    async editTipoDeVivienda(
        @Param('id') id: string,
        @Body() clientesData: Cliente
    ): Promise<Cliente> {
        const {
            nombre,
            apellidos,
            fechaDeNacimiento,
            rfc,
            curp,
            telefono1,
            telefono2,
            montoMinimo,
            montoMaximo,
            numeroCreditosCrecer,
            estadoCivilId,
            tipoDeViviedaId,
            escolaridadId,
            generoId,
            creadoPor,
        } = clientesData;
        return this.clientesService.updateClientes({
            where: { id: Number(id) },
            data: {
                nombre,
                apellidos,
                fechaDeNacimiento,
                rfc,
                curp,
                telefono1,
                telefono2,
                montoMinimo,
                montoMaximo,
                numeroCreditosCrecer,
                estadoCivil: { connect: { id: estadoCivilId } },
                tipoDeVivienda: { connect: { id: tipoDeViviedaId } },
                escolaridad: { connect: { id: escolaridadId } },
                genero: { connect: { id: generoId } },
                creadoPor,
            },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('clientes/:id')
    async deleteTipoDeVivienda(@Param('id') id: string): Promise<Cliente> {
        return this.clientesService.deleteClientes({ id: Number(id) });
    }
}
