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
import { Genero, Prisma, Role } from '@prisma/client';
import { ParentescosService } from './parentescos.service';
import { Public, Roles } from 'api/decorators';
import { IParentescoReturnDto } from 'api/dtos';
import { RolesGuard } from 'api/guards';

@Controller()
export class ParentescosController {
  constructor(private readonly parentescosService: ParentescosService) {}

  @UseGuards(RolesGuard)
  @Public()
  @Get('parentescos')
  async getParentescos(): Promise<IParentescoReturnDto[]> {
    return this.parentescosService.parentescos();
  }

  @UseGuards(RolesGuard)
  @Public()
  @Get('parentesco/:id')
  async getParentesco(
    @Param('id') id: string
  ): Promise<IParentescoReturnDto | null> {
    return this.parentescosService.parentesco({ id });
  }

  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Roles(Role.ADMIN)
  @Post('parentesco')
  async createParentesco(
    @Body() data: Prisma.ParentescoCreateInput
  ): Promise<IParentescoReturnDto> {
    return this.parentescosService.createParentesco(data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('parentesco/:id')
  async editParentesco(
    @Param('id') id: string,
    @Body() data: Genero
  ): Promise<IParentescoReturnDto> {
    return this.parentescosService.updateParentesco({
      where: { id },
      data,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('parentesco/:id')
  async deleteParentesco(
    @Param('id') id: string
  ): Promise<IParentescoReturnDto> {
    return this.parentescosService.deleteParentesco({ id });
  }
}
