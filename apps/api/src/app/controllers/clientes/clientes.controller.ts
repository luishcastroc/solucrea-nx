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
import { Prisma, Role } from '@prisma/client';
import { ClientesService } from './clientes.service';
import { Public, Roles } from 'api/decorators';
import {
  CreateClienteDto,
  IClienteReturnDto,
  UpdateClienteDto,
} from 'api/dtos';
import { RolesGuard } from 'api/guards';

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
  async getCliente(@Param('id') id: string): Promise<IClienteReturnDto | null> {
    return this.clientesService.cliente({ id });
  }

  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
  @Post('cliente')
  async createCliente(
    @Request() req: any,
    @Body() data: CreateClienteDto
  ): Promise<IClienteReturnDto> {
    const creadoPor = req.user.username;
    data.creadoPor = creadoPor;
    return this.clientesService.createCliente(data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
  @Put('cliente/:id')
  async editCliente(
    @Request() req: any,
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
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
  @Delete('cliente/:id')
  async deleteCliente(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: Prisma.ClienteUpdateInput
  ): Promise<IClienteReturnDto> {
    const actualizadoPor = req.user.username;
    data.actualizadoPor = actualizadoPor;
    return this.clientesService.deleteCliente({
      where: { id },
      data,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(
    Role.ADMIN,
    Role.CAJERO,
    Role.DIRECTOR,
    Role.MANAGER,
    Role.SECRETARIO,
    Role.USUARIO
  )
  @Post('clientes')
  async getClientesByWhere(
    @Body() search: { data: string }
  ): Promise<IClienteReturnDto[]> {
    const { data } = search;
    return this.clientesService.getClientesByWhere(data);
  }

  @UseGuards(RolesGuard)
  @Roles(
    Role.ADMIN,
    Role.CAJERO,
    Role.DIRECTOR,
    Role.MANAGER,
    Role.SECRETARIO,
    Role.USUARIO
  )
  @Get('clientes-count')
  async getClientesCount(): Promise<number> {
    return this.clientesService.getClientesCount();
  }
}
