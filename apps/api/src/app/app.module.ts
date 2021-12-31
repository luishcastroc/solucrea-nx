import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import {
    ActividadesEconomicasModule,
    AvalesModule,
    CajaModule,
    CiudadModule,
    ClientesModule,
    ColoniasModule,
    CreditosModule,
    DireccionesModule,
    EscolaridadesModule,
    EstadoModule,
    EstadosCivilesModule,
    GenerosModule,
    ParentescosModule,
    ProductosModule,
    SucursalesModule,
    TiposViviendaModule,
    UsuariosModule,
} from './controllers';
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
        ColoniasModule,
        AvalesModule,
        ActividadesEconomicasModule,
        ProductosModule,
        CreditosModule,
        ParentescosModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
