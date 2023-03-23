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
import { MovimientoDeCaja, Prisma, Role } from '@prisma/client';
import { Public, Roles } from 'api/decorators';
import { RolesGuard } from 'api/guards';

import { MovimientosService } from './movimientos.service';

@Controller()
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @UseGuards(RolesGuard)
  @Public()
  @Get('movimientos/:id')
  async getMovimientos(@Param('id') id: string): Promise<MovimientoDeCaja[]> {
    return this.movimientosService.movimientos(id);
  }

  @UseGuards(RolesGuard)
  @Public()
  @Get('movimiento/:id')
  async getMovimiento(@Param('id') id: string): Promise<MovimientoDeCaja | null> {
    return this.movimientosService.movimiento({ id });
  }

  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
  @Post('movimiento')
  async createMovimiento(
    @Request() req: any,
    @Body() data: Prisma.MovimientoDeCajaCreateInput
  ): Promise<MovimientoDeCaja> {
    const creadoPor = req.user.username;
    data.creadoPor = creadoPor;
    return this.movimientosService.createMovimiento(data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.USUARIO)
  @Put('movimiento/:id')
  async editMovimiento(@Param('id') id: string, @Body() data: MovimientoDeCaja): Promise<MovimientoDeCaja> {
    return this.movimientosService.updateMovimiento({
      where: { id },
      data,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.DIRECTOR)
  @Delete('movimiento/:id')
  async deleteMovimiento(@Param('id') id: string): Promise<MovimientoDeCaja> {
    return this.movimientosService.deleteMovimiento({ id });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CAJERO, Role.DIRECTOR, Role.MANAGER, Role.SECRETARIO, Role.USUARIO)
  @Get('movimientos-count/:id')
  async getMovimientosCount(@Param('id') id: string): Promise<number> {
    return this.movimientosService.getMovimientosCount(id);
  }
}
