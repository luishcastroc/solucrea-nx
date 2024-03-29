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
  SegurosModule,
  SucursalesModule,
  TiposViviendaModule,
  UsuariosModule,
} from './controllers';
import { MovimientosModule } from './controllers/movimientos/movimientos.module';
import { PagosModule } from './controllers/pagos';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    MovimientosModule,
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
    SegurosModule,
    PagosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
