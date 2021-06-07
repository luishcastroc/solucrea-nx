import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { AvalesModule } from './controllers/avales/';
import { CajaModule } from './controllers/caja/';
import { CiudadModule } from './controllers/ciudad/';
import { ClientesModule } from './controllers/clientes/';
import { CodigoPostalModule } from './controllers/codigo-postal/';
import { DireccionesModule } from './controllers/direcciones';
import { EscolaridadesModule } from './controllers/escolaridades';
import { EstadoModule } from './controllers/estado/';
import { EstadosCivilesModule } from './controllers/estados-civiles';
import { FraccionamientosModule } from './controllers/fraccionamientos/';
import { GenerosModule } from './controllers/generos';
import { SucursalesModule } from './controllers/sucursales';
import { TiposViviendaModule } from './controllers/tipos-vivienda';
import { UsuariosModule } from './controllers/usuarios';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [
        UsuariosModule,
        SucursalesModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        EstadosCivilesModule,
        TiposViviendaModule,
        GenerosModule,
        EscolaridadesModule,
        DireccionesModule,
        ClientesModule,
        CajaModule,
        EstadoModule,
        CiudadModule,
        FraccionamientosModule,
        CodigoPostalModule,
        AvalesModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
