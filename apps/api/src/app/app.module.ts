import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './controllers/clientes/clientes.module';
import { DireccionesModule } from './controllers/direcciones/direcciones.module';
import { EscolaridadesModule } from './controllers/escolaridades/escolaridades.module';
import { EstadosCivilesModule } from './controllers/estados-civiles/estados-civiles.module';
import { GenerosModule } from './controllers/generos/generos.module';
import { SucursalesModule } from './controllers/sucursales/sucursales.module';
import { TiposViviendaModule } from './controllers/tipos-vivienda/tipos-vivienda.module';
import { UsuariosModule } from './controllers/usuarios/usuarios.module';
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
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
