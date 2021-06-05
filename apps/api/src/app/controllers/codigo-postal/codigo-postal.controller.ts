import { Public } from './../../decorators/public.decorator';
import { CreateCodigoPostalDto } from './../../dtos/create-codigo-postal.dto';
import { Roles } from './../../decorators/roles.decorator';
import { RolesGuard } from './../../guards/roles.guard';
import { CodigoPostalService } from './codigo-postal.service';
import { CodigoPostal, Role } from '@prisma/client';
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

@Controller()
export class CodigoPostalController {
    constructor(private readonly codigoPostalService: CodigoPostalService) {}

    @UseGuards(RolesGuard)
    @Public()
    @Get('codigos-postales')
    async getCodigoPostals(): Promise<CodigoPostal[]> {
        return this.codigoPostalService.codigosPostales();
    }

    @UseGuards(RolesGuard)
    @Public()
    @Get('codigo-postal/:id')
    async getCodigoPostal(@Param('id') id: string): Promise<CodigoPostal> {
        return this.codigoPostalService.codigoPostal({ id });
    }

    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ADMIN)
    @Post('CodigoPostal')
    async createCodigoPostal(
        @Body() data: CreateCodigoPostalDto
    ): Promise<CodigoPostal> {
        return this.codigoPostalService.createCodigoPostal(data);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Put('codigo-postal/:id')
    async editCodigoPostal(
        @Param('id') id: string,
        @Body() data: CodigoPostal
    ): Promise<CodigoPostal> {
        return this.codigoPostalService.updateCodigoPostal({
            where: { id },
            data,
        });
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('codigo-postal/:id')
    async deleteCodigoPostal(@Param('id') id: string): Promise<CodigoPostal> {
        return this.codigoPostalService.deleteCodigoPostal({ id });
    }
}
