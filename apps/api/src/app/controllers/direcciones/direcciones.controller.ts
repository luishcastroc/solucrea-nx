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
import { Direccion, Role } from '@prisma/client';

import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { DireccionesService } from './direcciones.service';

@Controller('direcciones')
export class DireccionesController {
    constructor(private readonly direccionesService: DireccionesService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('direcciones')
    async getDirecciones(): Promise<Direccion[]> {
        return this.direccionesService.direcciones();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('direcciones/:id')
    async getDireccion(@Param('id') id: number): Promise<Direccion> {
        return this.direccionesService.direccion({ id: Number(id) });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('direcciones')
    async createDireccion(
        @Body() direccionData: Direccion
    ): Promise<Direccion> {
        const {
            tipo,
            calle,
            numero,
            cruzamientos,
            colonia,
            codigoPostalId,
            ciudadId,
            estadoId,
            clienteId,
        } = direccionData;
        return this.direccionesService.createDireccion({
            tipo,
            calle,
            numero,
            cruzamientos,
            colonia,
            codigoPostal: { connect: { id: codigoPostalId } },
            ciudad: { connect: { id: ciudadId } },
            estado: { connect: { id: estadoId } },
            cliente: { connect: { id: clienteId } },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('direcciones/:id')
    async editDireccion(
        @Param('id') id: string,
        @Body() direccionData: Direccion
    ): Promise<Direccion> {
        const {
            tipo,
            calle,
            numero,
            cruzamientos,
            colonia,
            codigoPostalId,
            ciudadId,
            estadoId,
            clienteId,
        } = direccionData;
        return this.direccionesService.updateDireccion({
            where: { id: Number(id) },
            data: {
                tipo,
                calle,
                numero,
                cruzamientos,
                colonia,
                codigoPostal: { connect: { id: codigoPostalId } },
                ciudad: { connect: { id: ciudadId } },
                estado: { connect: { id: estadoId } },
                cliente: { connect: { id: clienteId } },
            },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('direcciones/:id')
    async deleteDireccion(@Param('id') id: string): Promise<Direccion> {
        return this.direccionesService.deleteDireccion({ id: Number(id) });
    }
}
