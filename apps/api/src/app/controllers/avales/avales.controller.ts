import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Aval, Prisma, Role } from '@prisma/client';
import { AvalesService } from './avales.service';
import { Public, Roles } from 'api/decorators';
import { CreateAvalDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class AvalesController {
  constructor(private readonly avalesService: AvalesService) {}

  @UseGuards(RolesGuard)
  @Public()
  @Get('avales')
  async getAvales(): Promise<Aval[]> {
    return this.avalesService.avales();
  }

  @UseGuards(RolesGuard)
  @Public()
  @Get('aval/:id')
  async getAval(@Param('id') id: string): Promise<Aval | null> {
    return this.avalesService.aval({ id });
  }

  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Roles(Role.ADMIN)
  @Post('aval')
  async createAvales(@Body() data: CreateAvalDto): Promise<Aval> {
    return this.avalesService.createAval(data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('aval/:id')
  async editAvales(@Param('id') id: string, @Body() data: Prisma.AvalUpdateInput): Promise<Aval> {
    return this.avalesService.updateAval({
      where: { id },
      data,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('aval/:id')
  async deleteAvales(@Param('id') id: string): Promise<Aval> {
    return this.avalesService.deleteAval({ id });
  }
}
