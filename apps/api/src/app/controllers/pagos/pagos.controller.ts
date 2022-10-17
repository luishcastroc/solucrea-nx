import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Genero, Pago, Prisma, Role } from '@prisma/client';
import { Public, Roles } from 'api/decorators';
import { RolesGuard } from 'api/guards';

import { PagosService } from './pagos.service';

@Controller()
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @UseGuards(RolesGuard)
  @Public()
  @Get('pagos/:creditoId')
  async getParentescos(@Param('creditoId') creditoId: string): Promise<Pago[]> {
    return this.pagosService.pagos(creditoId);
  }

  @UseGuards(RolesGuard)
  @Public()
  @Get('pago/:id')
  async getParentesco(@Param('id') id: string): Promise<Pago | null> {
    return this.pagosService.pago({ id });
  }

  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Roles(Role.ADMIN)
  @Post('pago')
  async createParentesco(@Body() data: Prisma.PagoCreateInput): Promise<Pago> {
    return this.pagosService.createPago(data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('pago/:id')
  async editParentesco(
    @Param('id') id: string,
    @Body() data: Genero
  ): Promise<Pago> {
    return this.pagosService.updatePago({
      where: { id },
      data,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('pago/:id')
  async deleteParentesco(@Param('id') id: string): Promise<Pago> {
    return this.pagosService.deletePago({ id });
  }
}
